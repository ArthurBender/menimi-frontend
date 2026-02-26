import type { CalendarTask } from "../api/types";

type CalendarEventStatus = CalendarTask["resource"]["status"];

const occurrenceStatusColorMap: Record<CalendarEventStatus, string> = {
  pending: "occurrence-status-pending",
  done: "occurrence-status-done",
  missed: "occurrence-status-missed",
};

export function getOccurrenceStatusColor(status: CalendarEventStatus): string {
  return `var(--${occurrenceStatusColorMap[status]})`;
}

export function getCalendarEventStyle(status: CalendarEventStatus) {
  const backgroundColor = getOccurrenceStatusColor(status);

  return {
    backgroundColor,
    borderColor: backgroundColor,
    color: "#FFFFFF",
  };
}
