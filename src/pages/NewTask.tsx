import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RRuleGenerator from "../components/RRuleGenerator";
import { timezoneOptions } from "../utils/timezones";
import { API_USER_ID } from "../api/config";
import { useTasks } from "../api/useTasks";
import { showToast } from "../utils/toast";

function getInitialTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Etc/UTC";
}

function getCurrentLocalDateTime() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
}

function getInitialStartsAt(value: string | null) {
  if (!value) return getCurrentLocalDateTime();

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return getCurrentLocalDateTime();

  return value;
}

const NewTask = () => {
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createTask } = useTasks();
  const initialStartsAt = getInitialStartsAt(searchParams.get("occurredAt"));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const startsAtValue = String(formData.get("starts_at") ?? "");
    const startsAt = new Date(startsAtValue);

    if (Number.isNaN(startsAt.getTime())) {
      showToast("error", "Please provide a valid start date.");
      setIsSubmitting(false);
      return;
    }

    try {
      await createTask({
        user_id: API_USER_ID,
        title,
        description: String(formData.get("description") ?? "").trim(),
        rrule: isRecurrent ? String(formData.get("rrule") ?? "").trim() || null : null,
        starts_at: startsAt.toISOString(),
        timezone: String(formData.get("timezone") ?? getInitialTimezone()),
        carry_over: formData.get("carry_over") === "on",
        active: true,
      });

      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-center">
        <h2 className="text-4xl font-bold">New Task</h2>
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <form className="flex flex-col gap-8 rounded-2xl bg-surface p-6" onSubmit={handleSubmit}>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="task-field-group">
              <label htmlFor="starts_at">
                <span title="required">*</span> Date / Starts At
              </label>
              <input
                id="starts_at"
                name="starts_at"
                type="datetime-local"
                defaultValue={initialStartsAt}
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
                defaultValue={getInitialTimezone()}
              >
                {timezoneOptions.map((timezone) => (
                  <option key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <RRuleGenerator />
          )}

          <div className="mt-2 flex justify-center">
            <button type="submit" className="calendar-navigation" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTask
