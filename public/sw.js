self.addEventListener("push", (event) => {
  const payload = parsePayload(event);
  const title = payload.title || "Menimi";
  const options = {
    body: payload.body,
    icon: payload.icon || "/logo.png",
    badge: payload.badge || "/logo.png",
    data: {
      url: payload.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(openWindow(targetUrl));
});

function parsePayload(event) {
  if (!event.data) return {};

  try {
    return event.data.json();
  } catch (_error) {
    return {};
  }
}

async function openWindow(targetUrl) {
  const windowClients = await clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  for (const client of windowClients) {
    if ("focus" in client) {
      await client.navigate(targetUrl);
      return client.focus();
    }
  }

  return clients.openWindow(targetUrl);
}
