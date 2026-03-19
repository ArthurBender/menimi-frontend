# Menimi Frontend

Menimi is a React + TypeScript frontend for managing recurring tasks, calendar occurrences, account preferences, and browser push notifications.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- i18next
- Axios

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The production build and lint commands are:

```bash
npm run build
npm run lint
```

## Environment

The app reads environment variables from `.env`.

Required values:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_VAPID_PUBLIC_KEY=your_public_vapid_key
```

- `VITE_API_BASE_URL`: backend base URL used by the API client.
- `VITE_VAPID_PUBLIC_KEY`: public VAPID key used to subscribe the browser to push notifications.

## Features

- Email/password authentication
- Task creation and editing
- Recurrent task scheduling with RRULEs
- Calendar occurrence management
- Theme and language preferences
- Browser push notification subscription

## Deployment Notes

- Serve the built app from `dist/`.
- Make sure the deployed frontend and backend use matching API and push notification configuration.
- Push notifications require HTTPS in production.
