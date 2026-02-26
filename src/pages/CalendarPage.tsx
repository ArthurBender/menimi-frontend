import { useState } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment";

import { tasks } from "../api/mock";
import { buildTaskEventsForMonth } from "../utils/occurrences";
import { getCalendarEventStyle } from "../utils/calendarEventColors";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
          events={calendarTasks}
          date={currentDate}
          eventPropGetter={(event) => ({
            style: getCalendarEventStyle(event.resource.status),
          })}
        />
      </div>
    </div>
  )
}

export default CalendarPage
