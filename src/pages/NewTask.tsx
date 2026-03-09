import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { API_USER_ID } from "../api/config";
import { useTasks } from "../api/useTasks";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createTask } = useTasks();
  const initialStartsAt = getInitialStartsAt(searchParams.get("occurredAt"));
  const initialTimezone = getInitialTimezone();

  const handleSubmit = async (values: {
    title: string;
    description: string;
    startsAtIso: string;
    timezone: string;
    carryOver: boolean;
    rrule: string | null;
  }) => {
    setIsSubmitting(true);

    try {
      await createTask({
        user_id: API_USER_ID,
        title: values.title,
        description: values.description,
        rrule: values.rrule,
        starts_at: values.startsAtIso,
        timezone: values.timezone,
        carry_over: values.carryOver,
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
        <TaskForm
          initialValues={{
            title: "",
            description: "",
            startsAt: initialStartsAt,
            timezone: initialTimezone,
            carryOver: false,
            isRecurrent: false,
          }}
          isSubmitting={isSubmitting}
          submitLabel="Create Task"
          submittingLabel="Creating..."
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default NewTask
