import type { Task } from "../api/types";

const username = "Arthur Bender";

const tasks: Task[] = [
  {
    "id": 21,
    "user_id": 6,
    "title": "Daily journal",
    "description": "Write a short daily journal entry.",
    "rrule": "FREQ=DAILY;INTERVAL=1",
    "starts_at": "2026-02-01T11:00:00.000Z",
    "timezone": "America/Sao_Paulo",
    "carry_over": false,
    "active": true,
    "created_at": "2026-02-04T14:35:58.357Z",
    "updated_at": "2026-02-04T14:35:58.357Z",
    "occurrences": [
      {
        "id": 31,
        "occurred_at": "2026-02-02T11:10:00.000Z",
        "status": "done"
      },
      {
        "id": 32,
        "occurred_at": "2026-02-02T11:10:00.000Z",
        "status": "done"
      },
      {
        "id": 33,
        "occurred_at": "2026-02-02T11:10:00.000Z",
        "status": "done"
      },
      {
        "id": 34,
        "occurred_at": "2026-02-02T11:10:00.000Z",
        "status": "done"
      },
      {
        "id": 35,
        "occurred_at": "2026-02-02T11:10:00.000Z",
        "status": "done"
      },
      {
        "id": 36,
        "occurred_at": "2026-02-02T11:10:00.000Z",
        "status": "done"
      },
      {
        "id": 37,
        "occurred_at": "2026-02-03T11:05:00.000Z",
        "status": "done"
      },
      {
        "id": 38,
        "occurred_at": "2026-02-04T11:40:00.000Z",
        "status": "missed"
      }
    ]
  },
  {
    "id": 22,
    "user_id": 6,
    "title": "Gym session",
    "description": "Strength training workout.",
    "rrule": "FREQ=WEEKLY;BYDAY=MO,WE,FR",
    "starts_at": "2026-02-03T21:30:00.000Z",
    "timezone": "America/Sao_Paulo",
    "carry_over": true,
    "active": true,
    "created_at": "2026-02-04T14:35:58.361Z",
    "updated_at": "2026-02-04T14:35:58.361Z",
    "occurrences": [
      {
        "id": 39,
        "occurred_at": "2026-02-02T22:10:00.000Z",
        "status": "done"
      },
      {
        "id": 40,
        "occurred_at": "2026-02-04T22:20:00.000Z",
        "status": "done"
      }
    ]
  },
  {
    "id": 23,
    "user_id": 6,
    "title": "Pay rent",
    "description": "Monthly rent payment.",
    "rrule": "FREQ=MONTHLY;BYMONTHDAY=5",
    "starts_at": "2026-02-05T12:00:00.000Z",
    "timezone": "America/Sao_Paulo",
    "carry_over": false,
    "active": true,
    "created_at": "2026-02-04T14:35:58.365Z",
    "updated_at": "2026-02-04T14:35:58.365Z",
    "occurrences": [
      {
        "id": 41,
        "occurred_at": "2026-02-05T12:05:00.000Z",
        "status": "done"
      },
      {
        "id": 42,
        "occurred_at": "2026-02-06T12:05:00.000Z",
        "status": "canceled"
      }
    ]
  },
  {
    "id": 24,
    "user_id": 6,
    "title": "Read a book",
    "description": "Read for 30 minutes.",
    "rrule": null,
    "starts_at": "2026-02-05T00:00:00.000Z",
    "timezone": "America/Sao_Paulo",
    "carry_over": false,
    "active": true,
    "created_at": "2026-02-04T14:35:58.370Z",
    "updated_at": "2026-02-04T14:35:58.370Z",
    "occurrences": []
  }
];

const resume = "You are still pending doing this, and this, and also that, and also don’t forget to do that, and also that, and maybe that too";

export { username, tasks, resume };