export type OccurrenceStatus = "done" | "missed" | "canceled";
export type EditableOccurrenceStatus = Exclude<OccurrenceStatus, "canceled">;

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  timezone: string;
}

export interface UserResponse {
  user: User;
}

export interface TaskOccurrence {
  id: number;
  occurred_at: string;
  status: OccurrenceStatus;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  rrule: string | null;
  starts_at: string;
  carry_over: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  occurrences: TaskOccurrence[];
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
    status: EditableOccurrenceStatus | "pending";
    generated: boolean;
    pendingSource?: "planned" | "carry_over";
    carriedFromOccurrenceId?: number;
  };
}

export interface CreateTaskInput {
  user_id?: number;
  title: string;
  description?: string;
  rrule?: string | null;
  starts_at: string;
  carry_over: boolean;
  active: boolean;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface SaveTaskOccurrenceInput {
  task_id: number;
  occurred_at: string;
  status: EditableOccurrenceStatus;
  carried_from?: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  timezone: string;
}

export interface UpdateAccountInput {
  email?: string;
  password?: string;
  password_confirmation?: string;
  first_name?: string;
  last_name?: string;
  timezone?: string;
}
