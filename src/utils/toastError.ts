import { toast } from "react-toastify";

export function toastApiError(error: unknown, fallbackMessage = "There was an error.") {
  const details = getErrorDetails(error);

  console.error("API error details:", error);

  if (details.length > 0) {
    console.error("API validation errors:", details);
  }

  toast.error(fallbackMessage);
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
