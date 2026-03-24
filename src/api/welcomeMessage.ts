import { API_BASE_URL } from "./config";
import { apiRequest } from "./client";

export interface WelcomeMessageResponse {
  message: string;
}

export function getWelcomeMessage() {
  return apiRequest<WelcomeMessageResponse>({
    url: `${API_BASE_URL}/welcome_message`,
    method: "GET",
  });
}
