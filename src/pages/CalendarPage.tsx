import { useState } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar"
import type { SlotInfo } from "react-big-calendar";
import moment from "moment";

import { tasks } from "../api/mock";
import type { CalendarTask } from "../api/types";
import OccurrenceModal from "../components/OccurrenceModal";
import { buildTaskEventsForMonth } from "../utils/occurrences";
import { getCalendarEventStyle } from "../utils/calendarEventColors";

const CalendarPage = () => {
  const calendarTasksData = tasks;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);
  const [addOccurrenceDate, setAddOccurrenceDate] = useState<Date | null>(null);

  const localizer = momentLocalizer(moment);

  const month = currentDate.toLocaleString('en-US', { month: 'long' });
  const year = currentDate.getFullYear();

  const calendarTasks = buildTaskEventsForMonth(calendarTasksData, currentDate);
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

  const handleEditOccurrenceSave = (_payload: { taskId: number; occurredAt: Date; status: "done" | "missed" }) => {
    closeOccurrenceModal();
  };

  const handleSlotSelect = ({ start }: SlotInfo) => {
    setSelectedTask(null);
    setAddOccurrenceDate(start);
  };

  const closeAddOccurrenceModal = () => {
    setAddOccurrenceDate(null);
  };

  const handleAddOccurrenceSave = (_payload: { taskId: number; occurredAt: Date; status: "done" | "missed" }) => {
    closeAddOccurrenceModal();
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
          tasks={calendarTasksData}
          initialTaskId={selectedTask.resource.taskId}
          initialDate={selectedTask.start}
          initialStatus={selectedTask.resource.status !== "pending" ? selectedTask.resource.status : "done"}
          onClose={closeOccurrenceModal}
          onSave={handleEditOccurrenceSave}
        />
      )}

      {addOccurrenceDate && (
        <OccurrenceModal
          key={`create-${addOccurrenceDate.toISOString()}`}
          mode="create"
          tasks={calendarTasksData}
          initialTaskId={null}
          initialDate={addOccurrenceDate}
          initialStatus="done"
          onClose={closeAddOccurrenceModal}
          onSave={handleAddOccurrenceSave}
        />
      )}
    </div>
  )
}

export default CalendarPage
