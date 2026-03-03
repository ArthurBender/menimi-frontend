import axios from "axios";
import type { AxiosRequestConfig } from "axios";

import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  status: number;
  details: string[];

  constructor(message: string, status: number, details: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export async function apiRequest<T>(config: AxiosRequestConfig) {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const details = extractErrorDetails(error.response?.data);
      const fallbackMessage = status >= 500
        ? "The server returned an error."
        : "The request could not be completed.";

      throw new ApiError(details[0] ?? fallbackMessage, status, details);
    }

    throw new ApiError("The request could not be completed.", 500);
  }
}

function extractErrorDetails(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") return [];

  const errors = (payload as { errors?: unknown }).errors;
  if (!Array.isArray(errors)) return [];

  return errors.filter((error): error is string => typeof error === "string");
}
