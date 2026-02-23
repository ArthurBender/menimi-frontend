type OccurrenceStatus = "done" | "missed";

export interface Task {
  id: number,
  user_id: number,
  title: string,
  description: string,
  rrule: string | null,
  starts_at: string,
  timezone: string,
  carry_over: boolean,
  active: boolean,
  created_at: string,
  updated_at: string,
  occurrences: {
    id: number,
    occurred_at: string,
    status: OccurrenceStatus | "canceled";
  }[]
}

export interface CalendarTask {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: {
    taskId: number;
    occurrenceId: number | null;
    status: OccurrenceStatus | "pending";
    generated: boolean;
  };
}