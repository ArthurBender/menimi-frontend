import { createContext } from "react";

import type { CreateTaskInput, SaveTaskOccurrenceInput, Task } from "./types";

export interface TasksContextValue {
  tasks: Task[];
  isLoading: boolean;
  refreshTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  createOccurrence: (input: SaveTaskOccurrenceInput) => Promise<void>;
  updateOccurrence: (occurrenceId: number, input: Partial<SaveTaskOccurrenceInput>) => Promise<void>;
}

export const TasksContext = createContext<TasksContextValue | null>(null);
