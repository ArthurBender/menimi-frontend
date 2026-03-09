import { useMemo, useState } from "react";
import type { SubmitEventHandler } from "react";
import { useNavigate } from "react-router-dom";

import type { EditableOccurrenceStatus, Task } from "../api/types";
import SelectField from "./custom-fields/SelectField";
import TextField from "./custom-fields/TextField";

interface OccurrenceModalProps {
  mode: "create" | "edit";
  tasks: Task[];
  initialTaskId: number | null;
  initialDate: Date;
  initialStatus: EditableOccurrenceStatus;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (payload: { taskId: number; occurredAt: Date; status: EditableOccurrenceStatus }) => void;
}

const STATUS_OPTIONS: Array<{ value: EditableOccurrenceStatus; label: string }> = [
  { value: "done", label: "Done" },
  { value: "missed", label: "Missed" },
];

function toDateTimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const OccurrenceModal = ({
  mode,
  tasks,
  initialTaskId,
  initialDate,
  initialStatus,
  isSaving = false,
  onClose,
  onSave,
}: OccurrenceModalProps) => {
  const navigate = useNavigate();
  const availableTasks = useMemo(
    () => (mode === "create" ? tasks.filter((task) => task.active) : tasks),
    [mode, tasks],
  );
  const defaultTaskId = initialTaskId ?? availableTasks[0]?.id ?? null;
  const hasAvailableTasks = availableTasks.length > 0;
  const title = mode === "create" ? "Add Task Occurrence" : "Edit Task Occurrence";
  const taskOptions = availableTasks.map((task) => ({
    value: task.id,
    label: task.title,
  }));
  const statusOptions = STATUS_OPTIONS.map((statusOption) => ({
    value: statusOption.value,
    label: statusOption.label,
  }));

  const [taskId, setTaskId] = useState<number | null>(defaultTaskId);
  const [status, setStatus] = useState<EditableOccurrenceStatus>(initialStatus);
  const [occurredAt, setOccurredAt] = useState(() => toDateTimeLocalValue(initialDate));

  const handleCreateTask = () => {
    navigate(`/new?occurredAt=${encodeURIComponent(occurredAt)}`);
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (taskId === null) return;

    const parsedDate = new Date(occurredAt);
    if (Number.isNaN(parsedDate.getTime())) return;

    onSave({ taskId, occurredAt: parsedDate, status });
  };

  const createTaskButton = (
    <button
      type="button"
      className="text-white px-2 py-1 w-fit mx-auto rounded bg-accent hover:bg-accent/80"
      onClick={handleCreateTask}
      disabled={isSaving}
    >
      Create New Task
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        className="w-full max-w-md rounded-2xl bg-light p-6 shadow-lg"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-center">{title}</h3>

        {!hasAvailableTasks ? (
          <div className="flex flex-col gap-2 items-center">
            <p className="mt-4 text-sm text-center">No active tasks available.</p>
            {createTaskButton}
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <SelectField
              id="occurrence-task"
              label="Task"
              value={taskId}
              options={taskOptions}
              onChange={(value) => setTaskId(value)}
              isSearchable
              isDisabled={mode === "edit" || isSaving}
            />

            {mode === "create" && createTaskButton}

            <hr className="border-accent" />

            <TextField
              id="occurrence-datetime"
              type="datetime-local"
              value={occurredAt}
              onChange={(event) => setOccurredAt(event.target.value)}
              disabled={isSaving}
              label="Date and time"
            />

            <SelectField
              id="occurrence-status"
              value={status}
              label="Status"
              options={statusOptions}
              onChange={(value) => {
                if (value) setStatus(value);
              }}
              isDisabled={isSaving}
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="calendar-navigation bg-gray-500! hover:bg-gray-600!"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          {hasAvailableTasks && (
            <button type="submit" className="calendar-navigation" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OccurrenceModal;
