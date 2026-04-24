import { useMemo, useState } from "react";
import type { SubmitEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import type { EditableOccurrenceStatus, Task } from "../api/types";
import Modal from "./Modal";
import SelectField from "./custom-fields/SelectField";
import TextField from "./custom-fields/TextField";

interface OccurrenceModalProps {
  mode: "create" | "edit";
  tasks: Task[];
  initialTaskId: number | null;
  initialDate: Date;
  initialStatus: EditableOccurrenceStatus;
  isPending?: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (payload: { taskId: number; occurredAt: Date; status: EditableOccurrenceStatus }) => void;
  onDelete?: () => void;
}

const STATUS_OPTIONS: Array<{ value: EditableOccurrenceStatus; labelKey: "calendar.done" | "calendar.missed" }> = [
  { value: "done", labelKey: "calendar.done" },
  { value: "missed", labelKey: "calendar.missed" },
];

function toDateTimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const HEADER_BTN = "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-light/60 text-light transition-colors hover:bg-light/20 disabled:cursor-not-allowed disabled:opacity-50";

const OccurrenceModal = ({
  mode,
  tasks,
  initialTaskId,
  initialDate,
  initialStatus,
  isPending = false,
  isSaving = false,
  onClose,
  onSave,
  onDelete,
}: OccurrenceModalProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const availableTasks = useMemo(
    () =>
      mode === "create"
        ? tasks.filter((task) => {
            if (!task.active) return false;
            if (task.rrule !== null) return true;
            return task.carry_over && !task.occurrences.some((o) => o.status === "done");
          })
        : tasks,
    [mode, tasks],
  );
  const defaultTaskId = initialTaskId ?? availableTasks[0]?.id ?? null;
  const hasAvailableTasks = availableTasks.length > 0;
  const title = mode === "create" ? t("calendar.addOccurrence") : t("calendar.editOccurrence");
  const taskOptions = availableTasks.map((task) => ({ value: task.id, label: task.title }));
  const statusOptions = STATUS_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }));

  const [taskId, setTaskId] = useState<number | null>(defaultTaskId);
  const [status, setStatus] = useState<EditableOccurrenceStatus>(initialStatus);
  const [occurredAt, setOccurredAt] = useState(() => toDateTimeLocalValue(initialDate));

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (taskId === null) return;
    const parsedDate = new Date(occurredAt);
    if (Number.isNaN(parsedDate.getTime())) return;
    onSave({ taskId, occurredAt: parsedDate, status });
  };

  const headerActions = (
    <>
      {mode === "edit" && (
        <button
          type="button"
          className={HEADER_BTN}
          disabled={isSaving}
          aria-label={t("calendar.editRelatedTask")}
          title={t("calendar.editRelatedTask")}
          onClick={() => taskId !== null && navigate(`/tasks/${taskId}/edit`)}
        >
          <FiEdit2 />
        </button>
      )}
      {mode === "edit" && !isPending && (
        <button
          type="button"
          className={HEADER_BTN}
          disabled={isSaving}
          aria-label={t("calendar.removeOccurrence")}
          title={t("calendar.removeOccurrence")}
          onClick={onDelete}
        >
          <FiTrash2 />
        </button>
      )}
      {mode === "create" && (
        <button
          type="button"
          className={HEADER_BTN}
          disabled={isSaving}
          aria-label={t("calendar.createTask")}
          title={t("calendar.createTask")}
          onClick={() => navigate(`/new?occurredAt=${encodeURIComponent(occurredAt)}`)}
        >
          <FiPlus />
        </button>
      )}
    </>
  );

  const footer = (
    <>
      <button
        type="button"
        className="button secondary"
        onClick={onClose}
        disabled={isSaving}
      >
        {t("common.cancel")}
      </button>
      {hasAvailableTasks && (
        <button type="submit" form="occurrence-form" className="button" disabled={isSaving}>
          {isSaving ? t("common.saving") : t("common.save")}
        </button>
      )}
    </>
  );

  return (
    <Modal title={title} onClose={onClose} headerActions={headerActions} footer={footer}>
      {!hasAvailableTasks ? (
        <p className="py-2 text-center text-sm">{t("calendar.noActiveTasks")}</p>
      ) : (
        <form id="occurrence-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <SelectField
            id="occurrence-task"
            label={t("common.task")}
            value={taskId}
            options={taskOptions}
            onChange={(value) => setTaskId(value)}
            isSearchable
            isDisabled={mode === "edit" || isSaving}
          />

          <hr className="border-accent" />

          <TextField
            id="occurrence-datetime"
            type="datetime-local"
            value={occurredAt}
            onChange={(event) => setOccurredAt(event.target.value)}
            disabled={isSaving}
            label={t("calendar.dateTime")}
          />

          <SelectField
            id="occurrence-status"
            value={status}
            label={t("common.status")}
            options={statusOptions}
            onChange={(value) => { if (value) setStatus(value); }}
            isDisabled={isSaving}
          />
        </form>
      )}
    </Modal>
  );
};

export default OccurrenceModal;
