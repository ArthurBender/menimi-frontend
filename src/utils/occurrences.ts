import { rrulestr } from "rrule";

import type { CalendarTask, Task, TaskOccurrence } from "../api/types";

const DEFAULT_EVENT_MINUTES = 30;
const EVENT_DURATION_MS = DEFAULT_EVENT_MINUTES * 60 * 1000;

const dateKeyFormatterByTimezone = new Map<string, Intl.DateTimeFormat>();

export function buildTaskEventsForMonth(tasks: Task[], date: Date): CalendarTask[] {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  const pendingRangeStart = getPendingRangeStart(monthStart);
  const carryOverDay = getCarryOverPendingDay(monthStart);

  const events: CalendarTask[] = [];

  for (const task of tasks) {
    const timezone = task.timezone || "Etc/UTC";
    const startsAt = new Date(task.starts_at);
    const monthStartKey = dayKeyInTimezone(monthStart, timezone);
    const monthEndKey = dayKeyInTimezone(monthEnd, timezone);
    const pendingStartKey = pendingRangeStart ? dayKeyInTimezone(pendingRangeStart, timezone) : null;

    const nonCanceledOccurrences = task.occurrences.filter((occurrence) => occurrence.status !== "canceled");
    const existingDays = new Set<string>();
    const pendingDays = new Set<string>();
    const hiddenMissedIds = getHiddenMissedOccurrenceIds(task, nonCanceledOccurrences);

    for (const occurrence of nonCanceledOccurrences) {
      const occurredAt = new Date(occurrence.occurred_at);
      const occurredAtDayKey = dayKeyInTimezone(occurredAt, timezone);
      existingDays.add(occurredAtDayKey);
    }

    for (const occurrence of nonCanceledOccurrences) {
      const occurredAt = new Date(occurrence.occurred_at);

      if (occurredAt < monthStart || occurredAt > monthEnd) continue;
      if (occurrence.status === "canceled") continue;
      if (occurrence.status === "missed" && hiddenMissedIds.has(occurrence.id)) continue;

      events.push(
        makeEvent({
          id: `occurrence-${occurrence.id}`,
          title: task.title,
          start: occurredAt,
          status: occurrence.status,
          taskId: task.id,
          occurrenceId: occurrence.id,
          generated: false,
        }),
      );
    }

    if (!task.active || !pendingStartKey) continue;

    const plannedDates = getPlannedDatesForRange(task, monthStart, monthEnd);

    for (const plannedDate of plannedDates) {
      const plannedDayKey = dayKeyInTimezone(plannedDate, timezone);
      if (compareDayKeys(plannedDayKey, pendingStartKey) < 0) continue;
      if (existingDays.has(plannedDayKey) || pendingDays.has(plannedDayKey)) continue;

      events.push(
        makeEvent({
          id: `pending-${task.id}-${plannedDayKey}`,
          title: task.title,
          start: plannedDate,
          status: "pending",
          taskId: task.id,
          occurrenceId: null,
          generated: true,
          pendingSource: "planned",
        }),
      );

      pendingDays.add(plannedDayKey);
    }

    console.log(task.carry_over);
    if (!task.carry_over) continue;

    for (const missedOccurrence of nonCanceledOccurrences.filter((occurrence) => occurrence.status === "missed")) {
      if (!carryOverDay) continue;

      const carryWindow = getCarryOverWindow({
        task,
        occurrences: nonCanceledOccurrences,
        missedOccurrence,
      });
      const carryOverDayKey = dayKeyInTimezone(carryOverDay, timezone);

      if (compareDayKeys(carryOverDayKey, monthStartKey) < 0 || compareDayKeys(carryOverDayKey, monthEndKey) > 0) continue;
      if (compareDayKeys(carryOverDayKey, carryWindow.startKey) < 0) continue;
      if (carryWindow.endExclusiveKey && compareDayKeys(carryOverDayKey, carryWindow.endExclusiveKey) >= 0) continue;
      if (pendingStartKey && compareDayKeys(carryOverDayKey, pendingStartKey) < 0) continue;
      if (existingDays.has(carryOverDayKey) || pendingDays.has(carryOverDayKey)) continue;

      events.push(
        makeEvent({
          id: `carry-over-${missedOccurrence.id}-${carryOverDayKey}`,
          title: task.title,
          start: combineDayKeyWithTemplateTime(carryOverDayKey, startsAt),
          status: "pending",
          taskId: task.id,
          occurrenceId: null,
          generated: true,
          pendingSource: "carry_over",
          carriedFromOccurrenceId: missedOccurrence.id,
        }),
      );

      pendingDays.add(carryOverDayKey);
    }
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}

function makeEvent(params: {
  id: string;
  title: string;
  start: Date;
  status: "pending" | "done" | "missed";
  taskId: number;
  occurrenceId: number | null;
  generated: boolean;
  pendingSource?: "planned" | "carry_over";
  carriedFromOccurrenceId?: number;
}): CalendarTask {
  return {
    id: params.id,
    title: params.title,
    start: params.start,
    end: new Date(params.start.getTime() + EVENT_DURATION_MS),
    allDay: false,
    resource: {
      taskId: params.taskId,
      occurrenceId: params.occurrenceId,
      status: params.status,
      generated: params.generated,
      pendingSource: params.pendingSource,
      carriedFromOccurrenceId: params.carriedFromOccurrenceId,
    },
  };
}

function getHiddenMissedOccurrenceIds(task: Task, occurrences: TaskOccurrence[]): Set<number> {
  const hiddenMissedIds = new Set<number>();
  if (!task.carry_over) return hiddenMissedIds;

  const timezone = task.timezone || "Etc/UTC";
  const nowDayKey = dayKeyInTimezone(new Date(), timezone);
  const missedOccurrences = occurrences.filter((occurrence) => occurrence.status === "missed");

  for (const missedOccurrence of missedOccurrences) {
    const carryWindow = getCarryOverWindow({
      task,
      occurrences,
      missedOccurrence,
    });

    if (
      compareDayKeys(nowDayKey, carryWindow.startKey) >= 0 &&
      (carryWindow.endExclusiveKey === null || compareDayKeys(nowDayKey, carryWindow.endExclusiveKey) < 0)
    ) {
      hiddenMissedIds.add(missedOccurrence.id);
    }
  }

  return hiddenMissedIds;
}

function getCarryOverWindow({
  task,
  occurrences,
  missedOccurrence,
}: {
  task: Task;
  occurrences: TaskOccurrence[];
  missedOccurrence: TaskOccurrence;
}) {
  const timezone = task.timezone || "Etc/UTC";
  const missedDate = new Date(missedOccurrence.occurred_at);
  const missedDayKey = dayKeyInTimezone(missedDate, timezone);

  const doneAfterMissed = occurrences
    .filter((occurrence) => occurrence.status === "done")
    .map((occurrence) => dayKeyInTimezone(new Date(occurrence.occurred_at), timezone))
    .filter((dayKey) => compareDayKeys(dayKey, missedDayKey) > 0)
    .sort(compareDayKeys)[0] ?? null;

  const recurrentCutoff = task.rrule ? getNextPlannedDayKey(task, missedDate) : null;

  return {
    startKey: addDaysToDayKey(missedDayKey, 1),
    endExclusiveKey: minNullableDayKey(doneAfterMissed, recurrentCutoff),
  };
}

function getPlannedDatesForRange(task: Task, rangeStart: Date, rangeEnd: Date): Date[] {
  const startsAt = new Date(task.starts_at);
  if (!task.rrule) return [startsAt];
  return parseRRule(task.rrule, startsAt).between(rangeStart, rangeEnd, true);
}

function getNextPlannedDayKey(task: Task, afterDate: Date): string | null {
  if (!task.rrule) return null;

  const startsAt = new Date(task.starts_at);
  const nextPlannedDate = parseRRule(task.rrule, startsAt).after(afterDate, false);
  if (!nextPlannedDate) return null;

  return dayKeyInTimezone(nextPlannedDate, task.timezone || "Etc/UTC");
}

function parseRRule(rrule: string, startsAt: Date) {
  const normalizedRule = rrule.trim().toUpperCase().startsWith("RRULE:")
    ? rrule.trim()
    : `RRULE:${rrule.trim()}`;

  return rrulestr(`DTSTART:${toUtcIcsDate(startsAt)}\n${normalizedRule}`);
}

function dayKeyInTimezone(value: Date, timezone: string): string {
  if (!dateKeyFormatterByTimezone.has(timezone)) {
    dateKeyFormatterByTimezone.set(
      timezone,
      new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    );
  }

  return dateKeyFormatterByTimezone.get(timezone)!.format(value);
}

function addDaysToDayKey(dayKey: string, days: number): string {
  const date = new Date(`${dayKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function compareDayKeys(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function minDayKey(a: string, b: string): string {
  return compareDayKeys(a, b) <= 0 ? a : b;
}

function minNullableDayKey(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return minDayKey(a, b);
}

function combineDayKeyWithTemplateTime(dayKey: string, templateDate: Date): Date {
  const hours = String(templateDate.getHours()).padStart(2, "0");
  const minutes = String(templateDate.getMinutes()).padStart(2, "0");
  return new Date(`${dayKey}T${hours}:${minutes}:00`);
}

function getPendingRangeStart(monthStart: Date): Date | null {
  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  if (monthStart < currentMonthStart) return null;
  if (monthStart > currentMonthStart) return monthStart;

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function getCarryOverPendingDay(monthStart: Date): Date | null {
  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  if (monthStart.getTime() !== currentMonthStart.getTime()) return null;

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function toUtcIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}
