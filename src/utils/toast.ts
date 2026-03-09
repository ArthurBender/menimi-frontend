import { toast } from "react-toastify";

type ToastType = "success" | "info" | "warning" | "error";

export function showToast(type: ToastType, message: string, error?: unknown) {
  if (error !== undefined) {
    const details = getErrorDetails(error);

    console.error("API error details:", error);

    if (details.length > 0) {
      console.error("API validation errors:", details);
    }
  }

  toast[type](message);
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error && "details" in error && Array.isArray(error.details)) {
    return error.details.filter((detail): detail is string => typeof detail === "string");
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return [];
}
