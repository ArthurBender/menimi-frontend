import { API_BASE_URL } from "./config";
import { apiRequest } from "./client";
import type {
  CreateTaskInput,
  SaveTaskOccurrenceInput,
  Task,
  TaskOccurrence,
  UpdateTaskInput,
} from "./types";

export function listTasks() {
  return apiRequest<Task[]>({
    url: `${API_BASE_URL}/tasks`,
    method: "GET",
  });
}

export function createTask(task: CreateTaskInput) {
  return apiRequest<Task>({
    url: `${API_BASE_URL}/tasks`,
    method: "POST",
    data: { task },
  });
}

export function updateTask(id: number, task: UpdateTaskInput) {
  return apiRequest<Task>({
    url: `${API_BASE_URL}/tasks/${id}`,
    method: "PATCH",
    data: { task },
  });
}

export function deleteTask(id: number) {
  return apiRequest<void>({
    url: `${API_BASE_URL}/tasks/${id}`,
    method: "DELETE",
  });
}

export function createTaskOccurrence(taskOccurrence: SaveTaskOccurrenceInput) {
  return apiRequest<TaskOccurrence>({
    url: `${API_BASE_URL}/task_occurrences`,
    method: "POST",
    data: { task_occurrence: taskOccurrence },
  });
}

export function updateTaskOccurrence(id: number, taskOccurrence: Partial<SaveTaskOccurrenceInput>) {
  return apiRequest<TaskOccurrence>({
    url: `${API_BASE_URL}/task_occurrences/${id}`,
    method: "PATCH",
    data: { task_occurrence: taskOccurrence },
  });
}

export function deleteTaskOccurrence(id: number) {
  return apiRequest<void>({
    url: `${API_BASE_URL}/task_occurrences/${id}`,
    method: "DELETE",
  });
}
