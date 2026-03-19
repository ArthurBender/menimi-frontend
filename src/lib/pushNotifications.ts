import {
  createPushSubscription,
  deletePushSubscription,
  type PushSubscriptionPayload,
} from "../api/pushSubscriptions";

const SERVICE_WORKER_PATH = "/sw.js";

export type PushSupportStatus =
  | "unsupported"
  | "blocked"
  | "disabled"
  | "enabled";

export function canUsePushNotifications() {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export async function registerPushServiceWorker() {
  if (!canUsePushNotifications()) return null;

  return navigator.serviceWorker.register(SERVICE_WORKER_PATH);
}

export async function getPushSupportStatus(): Promise<PushSupportStatus> {
  if (!canUsePushNotifications()) return "unsupported";
  if (Notification.permission === "denied") return "blocked";

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  return subscription ? "enabled" : "disabled";
}

export async function enablePushNotifications() {
  if (!canUsePushNotifications()) {
    throw new Error("Push notifications are not supported in this browser.");
  }

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    throw new Error("Missing VITE_VAPID_PUBLIC_KEY.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();

  const subscription = existingSubscription ?? await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64UrlToUint8Array(vapidPublicKey),
  });

  const payload = serializePushSubscription(subscription);
  await createPushSubscription(payload);

  return payload;
}

export async function disablePushNotifications() {
  if (!canUsePushNotifications()) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) return;

  await deletePushSubscription(subscription.endpoint);
  await subscription.unsubscribe();
}

function serializePushSubscription(
  subscription: PushSubscription,
): PushSubscriptionPayload {
  const json = subscription.toJSON();
  const auth = json.keys?.auth;
  const p256dh = json.keys?.p256dh;

  if (!auth || !p256dh) {
    throw new Error("Push subscription keys are missing.");
  }

  return {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime,
    keys: {
      auth,
      p256dh,
    },
  };
}

function base64UrlToUint8Array(value: string) {
  const normalized = value.padEnd(value.length + (4 - (value.length % 4 || 4)) % 4, "=")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = window.atob(normalized);

  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}
