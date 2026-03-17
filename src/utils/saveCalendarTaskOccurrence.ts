import type { CalendarTask, EditableOccurrenceStatus, SaveTaskOccurrenceInput } from "../api/types";

interface SaveCalendarTaskOccurrenceParams {
  calendarTask: CalendarTask;
  taskId: number;
  occurredAt: Date;
  status: EditableOccurrenceStatus;
  createOccurrence: (input: SaveTaskOccurrenceInput) => Promise<void>;
  updateOccurrence: (occurrenceId: number, input: Partial<SaveTaskOccurrenceInput>) => Promise<void>;
}

export async function saveCalendarTaskOccurrence({
  calendarTask,
  taskId,
  occurredAt,
  status,
  createOccurrence,
  updateOccurrence,
}: SaveCalendarTaskOccurrenceParams) {
  const occurredAtIso = occurredAt.toISOString();

  if (calendarTask.resource.occurrenceId) {
    await updateOccurrence(calendarTask.resource.occurrenceId, {
      task_id: taskId,
      occurred_at: occurredAtIso,
      status,
    });
    return;
  }

  if (
    calendarTask.resource.pendingSource === "carry_over" &&
    calendarTask.resource.carriedFromOccurrenceId
  ) {
    if (status === "done") {
      await createOccurrence({
        task_id: taskId,
        occurred_at: occurredAtIso,
        status,
        carried_from: calendarTask.resource.carriedFromOccurrenceId,
      });
      return;
    }

    await updateOccurrence(calendarTask.resource.carriedFromOccurrenceId, {
      task_id: taskId,
      occurred_at: occurredAtIso,
      status,
    });
    return;
  }

  await createOccurrence({
    task_id: taskId,
    occurred_at: occurredAtIso,
    status,
  });
}
