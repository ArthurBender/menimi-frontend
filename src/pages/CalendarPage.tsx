import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Calendar, momentLocalizer } from "react-big-calendar"
import type { SlotInfo } from "react-big-calendar";
import moment from "moment";

import type { CalendarTask } from "../api/types";
import OccurrenceModal from "../components/OccurrenceModal";
import { useAuth } from "../api/useAuth";
import { localeFromLanguage } from "../i18n/config";
import { buildTaskEventsForMonth } from "../utils/occurrences";
import { getCalendarEventStyle } from "../utils/calendarEventColors";
import { useTasks } from "../api/useTasks";

const CalendarPage = () => {
  const { user } = useAuth();
  const { tasks, isLoading, createOccurrence, updateOccurrence, deleteOccurrence } = useTasks();
  const { t, i18n } = useTranslation();
  const locale = localeFromLanguage(i18n.resolvedLanguage);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);
  const [addOccurrenceDate, setAddOccurrenceDate] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const localizer = momentLocalizer(moment);

  const monthYear = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  const calendarTasks = buildTaskEventsForMonth(tasks, currentDate, user?.timezone ?? "Etc/UTC");
  const handleMonthChange = (type: "next" | "previous") => {
    if (type === "next") {
      setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    } else {
      setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    }
  }

  const handleTaskSelect = (task: CalendarTask) => {
    setAddOccurrenceDate(null);
    setSelectedTask(task);
  };

  const closeOccurrenceModal = () => {
    setSelectedTask(null);
  };

  const handleEditOccurrenceSave = async (payload: { taskId: number; occurredAt: Date; status: "done" | "missed" }) => {
    setIsSaving(true);

    try {
      if (selectedTask?.resource.occurrenceId) {
        await updateOccurrence(selectedTask.resource.occurrenceId, {
          task_id: payload.taskId,
          occurred_at: payload.occurredAt.toISOString(),
          status: payload.status,
        });
      } else {
        await createOccurrence({
          task_id: payload.taskId,
          occurred_at: payload.occurredAt.toISOString(),
          status: payload.status,
          carried_from:
            selectedTask?.resource.pendingSource === "carry_over" &&
            payload.status === "done"
              ? selectedTask.resource.carriedFromOccurrenceId
              : undefined,
        });
      }

      closeOccurrenceModal();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOccurrence = async () => {
    if (!selectedTask?.resource.occurrenceId) return;

    setIsSaving(true);

    try {
      await deleteOccurrence(selectedTask.resource.occurrenceId);
      closeOccurrenceModal();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSlotSelect = ({ start }: SlotInfo) => {
    setSelectedTask(null);
    setAddOccurrenceDate(start);
  };

  const closeAddOccurrenceModal = () => {
    setAddOccurrenceDate(null);
  };

  const handleAddOccurrenceSave = async (payload: { taskId: number; occurredAt: Date; status: "done" | "missed" }) => {
    setIsSaving(true);

    try {
      await createOccurrence({
        task_id: payload.taskId,
        occurred_at: payload.occurredAt.toISOString(),
        status: payload.status,
      });
      closeAddOccurrenceModal();
    } catch {
      // Toast handled in TasksContext.
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center gap-10">
        <h2 className="text-4xl font-bold">{monthYear}</h2>

        <div className="flex gap-2">
          <button className="calendar-navigation" onClick={() => handleMonthChange("previous")}>{t("common.previous")}</button>
          <button className="calendar-navigation" onClick={() => handleMonthChange("next")}>{t("common.next")}</button>
        </div>
      </div>

      {isLoading && <p className="rounded-2xl bg-surface p-4 text-center">{t("calendar.loading")}</p>}

      <div className="h-150">
        <Calendar
          localizer={localizer}
          views={["month"]}
          toolbar={false}
          selectable
          events={calendarTasks}
          date={currentDate}
          onSelectEvent={handleTaskSelect}
          onSelectSlot={handleSlotSelect}
          eventPropGetter={(event) => ({
            style: getCalendarEventStyle(event.resource.status),
          })}
        />
      </div>

      {selectedTask && (
        <OccurrenceModal
          key={`edit-${selectedTask.resource.taskId}-${selectedTask.start.toISOString()}-${selectedTask.resource.status}`}
          mode="edit"
          tasks={tasks}
          initialTaskId={selectedTask.resource.taskId}
          initialDate={selectedTask.start}
          initialStatus={selectedTask.resource.status !== "pending" ? selectedTask.resource.status : "done"}
          isPending={selectedTask.resource.status === "pending"}
          isSaving={isSaving}
          onClose={closeOccurrenceModal}
          onSave={handleEditOccurrenceSave}
          onDelete={handleDeleteOccurrence}
        />
      )}

      {addOccurrenceDate && (
        <OccurrenceModal
          key={`create-${addOccurrenceDate.toISOString()}`}
          mode="create"
          tasks={tasks}
          initialTaskId={null}
          initialDate={addOccurrenceDate}
          initialStatus="done"
          isSaving={isSaving}
          onClose={closeAddOccurrenceModal}
          onSave={handleAddOccurrenceSave}
        />
      )}
    </div>
  )
}

export default CalendarPage
