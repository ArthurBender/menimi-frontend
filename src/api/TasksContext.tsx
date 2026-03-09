import { useCallback, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

import { createTask, createTaskOccurrence, listTasks, updateTaskOccurrence } from "./tasks";
import type { CreateTaskInput, SaveTaskOccurrenceInput, Task } from "./types";
import { TasksContext } from "./tasks-context";
import { showToast } from "../utils/toast";

export function TasksProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTasks = useCallback(async () => {
    try {
      const response = await listTasks();
      setTasks(response);
    } catch (error) {
      showToast("error", "There was an error loading tasks.", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      const task = await createTask(input);
      setTasks((current) => [...current, task]);
      showToast("success", "Task created successfully.");
      return task;
    } catch (error) {
      showToast("error", "There was an error creating the task.", error);
      throw error;
    }
  };

  const handleCreateOccurrence = async (input: SaveTaskOccurrenceInput) => {
    try {
      await createTaskOccurrence(input);
      await refreshTasks();
      showToast("success", "Occurrence created successfully.");
    } catch (error) {
      showToast("error", "There was an error creating the occurrence.", error);
      throw error;
    }
  };

  const handleUpdateOccurrence = async (
    occurrenceId: number,
    input: Partial<SaveTaskOccurrenceInput>,
  ) => {
    try {
      await updateTaskOccurrence(occurrenceId, input);
      await refreshTasks();
      showToast("success", "Occurrence updated successfully.");
    } catch (error) {
      showToast("error", "There was an error saving the occurrence.", error);
      throw error;
    }
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
