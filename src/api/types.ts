export interface Task {
  id: number,
  user_id: number,
  title: string,
  description: string,
  rrule: string,
  starts_at: string,
  timezone: string,
  carry_over: boolean,
  active: boolean,
  created_at: string,
  updated_at: string,
  occurrences: {
    id: number,
    occurred_at: string,
    status: string
  }[]
}