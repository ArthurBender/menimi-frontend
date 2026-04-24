import { cloneElement, useState } from "react";
import { useTranslation } from "react-i18next";

import { Calendar, momentLocalizer } from "react-big-calendar"
import type { DateCellWrapperProps } from "react-big-calendar";
import moment from "moment";

import type { CalendarTask } from "../api/types";
import Modal from "../components/Modal";
import OccurrenceModal from "../components/OccurrenceModal";
import { useAuth } from "../api/useAuth";
import { localeFromLanguage } from "../i18n/config";
import { capitalize } from "../utils/formatting";
import { buildTaskEventsForMonth } from "../utils/occurrences";
import { getCalendarEventStyle } from "../utils/calendarEventColors";
import { saveCalendarTaskOccurrence } from "../utils/saveCalendarTaskOccurrence";
import { useTasks } from "../api/useTasks";

const CalendarPage = () => {
  const { user } = useAuth();
  const { tasks, isLoading, createOccurrence, updateOccurrence, deleteOccurrence } = useTasks();
  const { t, i18n } = useTranslation();
  const locale = localeFromLanguage(i18n.resolvedLanguage);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);
  const [addOccurrenceDate, setAddOccurrenceDate] = useState<Date | null>(null);
  const [showMoreDate, setShowMoreDate] = useState<Date | null>(null);
  const [showMoreEvents, setShowMoreEvents] = useState<CalendarTask[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const localizer = momentLocalizer(moment);

  const monthYear = capitalize(
    new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }).format(currentDate),
  );

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
    setShowMoreDate(null);
    setShowMoreEvents([]);
    setSelectedTask(task);
  };

  const closeOccurrenceModal = () => {
    setSelectedTask(null);
  };

  const handleEditOccurrenceSave = async (payload: { taskId: number; occurredAt: Date; status: "done" | "missed" }) => {
    setIsSaving(true);

    try {
      if (!selectedTask) return;

      await saveCalendarTaskOccurrence({
        calendarTask: selectedTask,
        taskId: payload.taskId,
        occurredAt: payload.occurredAt,
        status: payload.status,
        createOccurrence,
        updateOccurrence,
      });

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

  const handleDateSelect = (date: Date) => {
    setSelectedTask(null);
    setShowMoreDate(null);
    setShowMoreEvents([]);
    setAddOccurrenceDate(date);
  };

  const handleShowMore = (events: CalendarTask[], date: Date) => {
    setSelectedTask(null);
    setAddOccurrenceDate(null);
    setShowMoreDate(date);
    setShowMoreEvents(events);
  };

  const closeAddOccurrenceModal = () => {
    setAddOccurrenceDate(null);
  };

  const closeShowMoreModal = () => {
    setShowMoreDate(null);
    setShowMoreEvents([]);
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

  const DateCellWrapper = ({ value, children }: DateCellWrapperProps) =>
    cloneElement(children, {
      onClick: () => handleDateSelect(value),
    });
  
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end gap-5">
        <h2 className="text-2xl md:text-3xl font-bold">{monthYear}</h2>

        <div className="flex gap-2">
          <button className="button" onClick={() => handleMonthChange("previous")}>{t("common.previous")}</button>
          <button className="button" onClick={() => handleMonthChange("next")}>{t("common.next")}</button>
        </div>
      </div>

      {isLoading && <p className="rounded-2xl bg-surface p-4 text-center">{t("calendar.loading")}</p>}

      <div className="h-[calc(100vh-15rem)]">
        <Calendar
          localizer={localizer}
          views={["month"]}
          toolbar={false}
          events={calendarTasks}
          date={currentDate}
          onSelectEvent={handleTaskSelect}
          onShowMore={handleShowMore}
          doShowMoreDrillDown={false}
          components={{ dateCellWrapper: DateCellWrapper }}
          eventPropGetter={(event) => ({
            style: getCalendarEventStyle(event.resource.status),
          })}
        />
      </div>

      {showMoreDate && (
        <Modal
          title={capitalize(
            new Intl.DateTimeFormat(locale, {
              weekday: "long",
              month: "long",
              day: "numeric",
            }).format(showMoreDate),
          )}
          onClose={closeShowMoreModal}
          footer={
            <div className="w-full text-center flex flex-col items-center gap-5">
              <hr className="w-full border-t-2 border-primary" />
              <button
                type="button"
                className="button bg-primary"
                onClick={closeShowMoreModal}
              >
                {t("common.cancel")}
              </button>
            </div>
          }
        >
          <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
            {showMoreEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                className="cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={getCalendarEventStyle(event.resource.status)}
                onClick={() => {
                  closeShowMoreModal();
                  handleTaskSelect(event);
                }}
              >
                {event.title}
              </button>
            ))}
          </div>
        </Modal>
      )}

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
