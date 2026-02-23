import { username, tasks, resume } from "../api/mock";
import HomeTaskRow from "../components/HomeTaskRow";

const Home = () => {
  return (
    <div className="p-20 w-full h-full">
      <div className="flex flex-col gap-10 justify-between h-full">
        <div className="flex gap-10 items-center justify-around">
          <h2 className="text-7xl font-semibold">Hey, there {username}!</h2>
          <i className="h-50 w-50 bg-gray-300"></i>
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
