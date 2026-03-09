import { useState } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar"
import type { SlotInfo } from "react-big-calendar";
import moment from "moment";

import type { CalendarTask } from "../api/types";
import OccurrenceModal from "../components/OccurrenceModal";
import { buildTaskEventsForMonth } from "../utils/occurrences";
import { getCalendarEventStyle } from "../utils/calendarEventColors";
import { useTasks } from "../api/useTasks";
import { toastApiError } from "../utils/toastError";

const CalendarPage = () => {
  const { tasks, isLoading, createOccurrence, updateOccurrence } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);
  const [addOccurrenceDate, setAddOccurrenceDate] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const localizer = momentLocalizer(moment);

  const month = currentDate.toLocaleString('en-US', { month: 'long' });
  const year = currentDate.getFullYear();

  const calendarTasks = buildTaskEventsForMonth(tasks, currentDate);
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
        });
      }

      closeOccurrenceModal();
    } catch (error) {
      toastApiError(error, "There was an error saving the occurrence.");
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
    } catch (error) {
      toastApiError(error, "There was an error creating the occurrence.");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center gap-10">
        <h2 className="text-4xl font-bold">{month} - {year}</h2>

        <div className="flex gap-2">
          <button className="calendar-navigation" onClick={() => handleMonthChange("previous")}>Previous</button>
          <button className="calendar-navigation" onClick={() => handleMonthChange("next")}>Next</button>
        </div>
      </div>

      {isLoading && <p className="rounded-2xl bg-surface p-4 text-center">Loading calendar...</p>}

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
          mode={selectedTask.resource.generated ? "create" : "edit"}
          tasks={tasks}
          initialTaskId={selectedTask.resource.taskId}
          initialDate={selectedTask.start}
          initialStatus={selectedTask.resource.status !== "pending" ? selectedTask.resource.status : "done"}
          isSaving={isSaving}
          onClose={closeOccurrenceModal}
          onSave={handleEditOccurrenceSave}
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
