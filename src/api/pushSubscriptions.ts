import { API_BASE_URL } from "./config";
import { apiRequest } from "./client";

export interface PushSubscriptionPayload {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export function createPushSubscription(subscription: PushSubscriptionPayload) {
  return apiRequest<void>({
    url: `${API_BASE_URL}/push_subscriptions`,
    method: "POST",
    data: { subscription },
  });
}

export function deletePushSubscription(endpoint: string) {
  return apiRequest<void>({
    url: `${API_BASE_URL}/push_subscriptions`,
    method: "DELETE",
    data: { endpoint },
  });
}
