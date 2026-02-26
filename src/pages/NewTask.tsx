import { useState } from "react";
import { timezoneOptions } from "../utils/timezones";

function getCurrentLocalDateTime() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
}

const NewTask = () => {
  const [isRecurrent, setIsRecurrent] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form className="mt-8 flex flex-col gap-8 rounded-2xl bg-surface p-6">
        <div className="flex justify-center">
          <h2 className="text-4xl font-bold">New Task</h2>
        </div>

        <div className="task-field-group">
          <label htmlFor="title">
            <span title="required">*</span> Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
          />
        </div>

        <div className="task-field-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="task-field-group">
            <label htmlFor="starts_at">
              <span title="required">*</span> Date / Starts At
            </label>
            <input
              id="starts_at"
              name="starts_at"
              type="datetime-local"
              defaultValue={getCurrentLocalDateTime()}
              required
            />
          </div>

          <div className="task-field-group">
            <label htmlFor="timezone">
              <span title="required">*</span> Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              required
              defaultValue="Etc/UTC"
            >
              {timezoneOptions.map((timezone) => (
                <option key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-center gap-2">
            <input
              id="recurrent"
              name="recurrent"
              type="checkbox"
              checked={isRecurrent}
              onChange={(event) => setIsRecurrent(event.target.checked)}
            />
            <label htmlFor="recurrent" className="text-sm font-semibold">Recurrent</label>
          </div>

          <div className="flex items-center gap-2">
            <input id="carry_over" name="carry_over" type="checkbox" />
            <label htmlFor="carry_over" className="text-sm font-semibold">Carry Over</label>
          </div>
        </div>

        {isRecurrent && (
          <div className="task-field-group">
            <label htmlFor="rrule">RRULE</label>
            <input
              id="rrule"
              name="rrule"
              type="text"
            />
          </div>
        )}

        <div className="mt-2 flex justify-center">
          <button type="button" className="calendar-navigation">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTask
