import { useMemo, useState } from "react";
import type { SubmitEventHandler } from "react";
import { useNavigate } from "react-router-dom";

import type { Task } from "../api/types";

type OccurrenceStatus = "done" | "missed";

interface OccurrenceModalProps {
  mode: "create" | "edit";
  tasks: Task[];
  initialTaskId: number | null;
  initialDate: Date;
  initialStatus: OccurrenceStatus;
  onClose: () => void;
  onSave: (payload: { taskId: number; occurredAt: Date; status: OccurrenceStatus }) => void;
}

const STATUS_OPTIONS: Array<{ value: OccurrenceStatus; label: string }> = [
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

const OccurrenceModal = ({ mode, tasks, initialTaskId, initialDate, initialStatus, onClose, onSave }: OccurrenceModalProps) => {
  const navigate = useNavigate();
  const availableTasks = useMemo(
    () => (mode === "create" ? tasks.filter((task) => task.active) : tasks),
    [mode, tasks],
  );
  const defaultTaskId = initialTaskId ?? availableTasks[0]?.id ?? null;
  const hasAvailableTasks = availableTasks.length > 0;
  const title = mode === "create" ? "Add Task Occurrence" : "Edit Task Occurrence";

  const [taskId, setTaskId] = useState<number | null>(defaultTaskId);
  const [status, setStatus] = useState<OccurrenceStatus>(initialStatus);
  const [occurredAt, setOccurredAt] = useState(() => toDateTimeLocalValue(initialDate));

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (taskId === null) return;

    const parsedDate = new Date(occurredAt);
    if (Number.isNaN(parsedDate.getTime())) return;

    onSave({ taskId, occurredAt: parsedDate, status });
  };

  const handleCreateTask = () => {
    navigate(`/new?occurredAt=${encodeURIComponent(occurredAt)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        className="w-full max-w-md rounded-2xl bg-light p-6 shadow-lg"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-center">{title}</h3>

        {!hasAvailableTasks ? (
          <p className="mt-4 text-sm">No active tasks available.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <div className="task-field-group">
              <label htmlFor="occurrence-task">Task</label>
              <div className="flex gap-2"></div>
              <select
                id="occurrence-task"
                value={taskId ?? ""}
                onChange={(event) => setTaskId(Number(event.target.value))}
                disabled={mode === "edit"}
              >
                {availableTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>

              {mode === "create" && (
                <button
                  type="button"
                  className="text-white px-2 py-1 w-fit mx-auto rounded bg-accent hover:bg-accent/80"
                  onClick={() => handleCreateTask()}
                >
                  Create New Task
                </button>
              )}
            </div>

            <hr className="border-accent" />

            <div className="task-field-group">
              <label htmlFor="occurrence-datetime">Date and time</label>
              <input
                id="occurrence-datetime"
                type="datetime-local"
                value={occurredAt}
                onChange={(event) => setOccurredAt(event.target.value)}
              />
            </div>

            <div className="task-field-group">
              <label htmlFor="occurrence-status">Status</label>
              <select
                id="occurrence-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as OccurrenceStatus)}
              >
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="calendar-navigation bg-gray-500! hover:bg-gray-600!" onClick={onClose}>
            Cancel
          </button>
          {hasAvailableTasks && (
            <button type="submit" className="calendar-navigation">
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OccurrenceModal;
