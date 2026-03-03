import { useContext } from "react";

import { TasksContext } from "./tasks-context";

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider.");
  }

  return context;
}
