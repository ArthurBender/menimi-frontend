import { username, tasks, resume } from "../api/mock";

import { Calendar, momentLocalizer } from "react-big-calendar"
import HomeTaskRow from "../components/HomeTaskRow";
import { useHomeCalendarEventRenderer } from "../components/HomeCalendarEventRenderer";

import moment from "moment";

import { buildTaskEventsForMonth } from "../utils/occurrences";

const Home = () => {
  const localizer = momentLocalizer(moment);
  const currentMonth = moment().format("MMMM - YYYY");

  const homeTasks = buildTaskEventsForMonth(tasks, new Date());
  const DateHeader = useHomeCalendarEventRenderer(homeTasks);
  
  return (
    <div className="p-20 w-full h-full">
      <div className="flex flex-col gap-10 justify-between h-full">
        <div className="flex gap-10 items-center justify-around">
          <h2 className="text-7xl font-semibold">Hey, there {username}!</h2>
          <div className="h-50 w-100">
            <p className="text-center font-medium">{currentMonth}</p>
            <Calendar 
              localizer={localizer}
              views={["month"]}
              toolbar={false}
              events={[]}
              components={{ month: { dateHeader: DateHeader } }}
            />
          </div>
        </div>

        <p className="text-xl bg-surface p-5 rounded-3xl">{resume}</p>

        <div className="flex gap-10">
          <div className="w-full">
            <h3 className="text-2xl font-semibold bg-accent w-full text-center p-2 rounded-3xl">Today</h3>

            <div className="flex flex-col">
              {tasks.map((task) => (
                <HomeTaskRow key={task.id} task={task} />
              ))}
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-2xl font-semibold bg-accent w-full text-center p-2 rounded-3xl">This Week</h3>

            <div className="flex flex-col">
              {tasks.map((task) => (
                <HomeTaskRow key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home
