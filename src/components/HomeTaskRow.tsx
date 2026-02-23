import type { Task } from "../api/types";

const HomeTaskRow = ({task}: {task: Task}) => {
  return (
    <div className="text-lg font-medium not-last:border-b border-dark text-center py-2">{task.title}</div>
  )
}

export default HomeTaskRow;