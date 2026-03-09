import { useCallback, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

import { createTask, createTaskOccurrence, listTasks, updateTaskOccurrence } from "./tasks";
import type { CreateTaskInput, SaveTaskOccurrenceInput, Task } from "./types";
import { TasksContext } from "./tasks-context";
import { toastApiError } from "../utils/toastError";

export function TasksProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTasks = useCallback(async () => {
    try {
      const response = await listTasks();
      setTasks(response);
    } catch (error) {
      toastApiError(error, "There was an error loading tasks.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  const handleCreateTask = async (input: CreateTaskInput) => {
    const task = await createTask(input);
    setTasks((current) => [...current, task]);
    return task;
  };

  const handleCreateOccurrence = async (input: SaveTaskOccurrenceInput) => {
    await createTaskOccurrence(input);
    await refreshTasks();
  };

  const handleUpdateOccurrence = async (
    occurrenceId: number,
    input: Partial<SaveTaskOccurrenceInput>,
  ) => {
    await updateTaskOccurrence(occurrenceId, input);
    await refreshTasks();
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isLoading,
        refreshTasks,
        createTask: handleCreateTask,
        createOccurrence: handleCreateOccurrence,
        updateOccurrence: handleUpdateOccurrence,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
