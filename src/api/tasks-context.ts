import { createContext } from "react";

import type { CreateTaskInput, SaveTaskOccurrenceInput, Task, UpdateTaskInput } from "./types";

export interface TasksContextValue {
  tasks: Task[];
  isLoading: boolean;
  refreshTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (taskId: number, input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (taskId: number) => Promise<void>;
  createOccurrence: (input: SaveTaskOccurrenceInput) => Promise<void>;
  updateOccurrence: (occurrenceId: number, input: Partial<SaveTaskOccurrenceInput>) => Promise<void>;
  deleteOccurrence: (occurrenceId: number) => Promise<void>;
}

export const TasksContext = createContext<TasksContextValue | null>(null);
