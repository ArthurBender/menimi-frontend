import type { Task, CalendarTask } from "../api/types";
import { rrulestr } from "rrule";

const DEFAULT_EVENT_MINUTES = 30;
const EVENT_DURATION_MS = DEFAULT_EVENT_MINUTES * 60 * 1000;

export function buildTaskEventsForMonth(tasks: Task[], date: Date): CalendarTask[] {
  // Set range
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  const pendingRangeStart = getPendingRangeStart(monthStart);

  const events: CalendarTask[] = [];
  const existingDaysByTask = new Map<number, Set<number>>();
  
  // Create events for existing occurrences
  for (const task of tasks) {
    for (const occurrence of task.occurrences) {
      const occurredAt = new Date(occurrence.occurred_at);
      if (occurrence.status === "canceled") continue;
      if (occurredAt < monthStart || occurredAt > monthEnd) continue;

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

      if (!existingDaysByTask.has(task.id)) existingDaysByTask.set(task.id, new Set<number>());
      existingDaysByTask.get(task.id)!.add(dayKey(occurredAt));
    }
  }

  // Create pending tasks
  if (pendingRangeStart) {
    for (const task of tasks) {
      if (!task.active) continue;

      const startsAt = new Date(task.starts_at);
      const existingDays = existingDaysByTask.get(task.id) ?? new Set<number>();
      const scheduledDates = task.rrule
        ? parseRRule(task.rrule, startsAt).between(pendingRangeStart, monthEnd, true)
        : [startsAt];

      for (const scheduledDate of scheduledDates) {
        const scheduledDay = dayKey(scheduledDate);
        if (!task.rrule && (scheduledDay < dayKey(monthStart) || scheduledDate > monthEnd)) continue;
        if (scheduledDate < pendingRangeStart) continue;
        if (existingDays.has(scheduledDay)) continue;

        events.push(
          makeEvent({
            id: `pending-${task.id}-${scheduledDay}`,
            title: task.title,
            start: scheduledDate,
            status: "pending",
            taskId: task.id,
            occurrenceId: null,
            generated: true,
          }),
        );
      }
    }
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
};

function makeEvent(params: {
  id: string;
  title: string;
  start: Date;
  status: "pending" | "done" | "missed";
  taskId: number;
  occurrenceId: number | null;
  generated: boolean;
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
    },
  };
}

function parseRRule(rrule: string, startsAt: Date) {
  const normalizedRule = rrule.trim().toUpperCase().startsWith("RRULE:")
    ? rrule.trim()
    : `RRULE:${rrule.trim()}`;
  return rrulestr(`DTSTART:${toUtcIcsDate(startsAt)}\n${normalizedRule}`);
}

function dayKey(value: Date): number {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
}

function getPendingRangeStart(monthStart: Date): Date | null {
  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  if (monthStart < currentMonthStart) return null;
  if (monthStart > currentMonthStart) return monthStart;

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function toUtcIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}
