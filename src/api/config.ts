const DEFAULT_API_BASE_URL = "http://localhost:3000/api/v1";
const DEFAULT_USER_ID = 1;

function toUserId(value: string | undefined) {
  const parsed = Number(value ?? DEFAULT_USER_ID);
  return Number.isFinite(parsed) ? parsed : DEFAULT_USER_ID;
}

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export const API_USER_ID = toUserId(import.meta.env.VITE_API_USER_ID);
