import { useCallback, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

import {
  createTask,
  createTaskOccurrence,
  deleteTask,
  deleteTaskOccurrence,
  listTasks,
  updateTask,
  updateTaskOccurrence,
} from "./tasks";
import type { CreateTaskInput, SaveTaskOccurrenceInput, Task, UpdateTaskInput } from "./types";
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

  const handleUpdateTask = async (taskId: number, input: UpdateTaskInput) => {
    try {
      const updatedTask = await updateTask(taskId, input);
      setTasks((current) => current.map((task) => (task.id === taskId ? updatedTask : task)));
      showToast("success", "Task updated successfully.");
      return updatedTask;
    } catch (error) {
      showToast("error", "There was an error updating the task.", error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      showToast("success", "Task deleted successfully.");
    } catch (error) {
      showToast("error", "There was an error deleting the task.", error);
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

  const handleDeleteOccurrence = async (occurrenceId: number) => {
    try {
      await deleteTaskOccurrence(occurrenceId);
      await refreshTasks();
      showToast("success", "Occurrence removed successfully.");
    } catch (error) {
      showToast("error", "There was an error removing the occurrence.", error);
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
        updateTask: handleUpdateTask,
        deleteTask: handleDeleteTask,
        createOccurrence: handleCreateOccurrence,
        updateOccurrence: handleUpdateOccurrence,
        deleteOccurrence: handleDeleteOccurrence,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
