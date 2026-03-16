import { useCallback, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

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
import { useAuth } from "./useAuth";

export function TasksProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(isAuthenticated);

  const refreshTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await listTasks();
      setTasks(response);
    } catch (error) {
      showToast("error", t("toast.tasksLoadError"), error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, t]);

  useEffect(() => {
    if (!isAuthenticated) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    void refreshTasks();
  }, [isAuthenticated, refreshTasks]);

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      const task = await createTask(input);
      setTasks((current) => [...current, task]);
      showToast("success", t("toast.taskCreated"));
      return task;
    } catch (error) {
      showToast("error", t("toast.taskCreateError"), error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId: number, input: UpdateTaskInput) => {
    try {
      const updatedTask = await updateTask(taskId, input);
      setTasks((current) => current.map((task) => (task.id === taskId ? updatedTask : task)));
      showToast("success", t("toast.taskUpdated"));
      return updatedTask;
    } catch (error) {
      showToast("error", t("toast.taskUpdateError"), error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      showToast("success", t("toast.taskDeleted"));
    } catch (error) {
      showToast("error", t("toast.taskDeleteError"), error);
      throw error;
    }
  };

  const handleCreateOccurrence = async (input: SaveTaskOccurrenceInput) => {
    try {
      await createTaskOccurrence(input);
      await refreshTasks();
      showToast("success", t("toast.occurrenceCreated"));
    } catch (error) {
      showToast("error", t("toast.occurrenceCreateError"), error);
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
      showToast("success", t("toast.occurrenceUpdated"));
    } catch (error) {
      showToast("error", t("toast.occurrenceUpdateError"), error);
      throw error;
    }
  };

  const handleDeleteOccurrence = async (occurrenceId: number) => {
    try {
      await deleteTaskOccurrence(occurrenceId);
      await refreshTasks();
      showToast("success", t("toast.occurrenceDeleted"));
    } catch (error) {
      showToast("error", t("toast.occurrenceDeleteError"), error);
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
