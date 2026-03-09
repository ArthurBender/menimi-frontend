import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TaskForm from "../components/TaskForm";
import { useTasks } from "../api/useTasks";

function toDateInputValue(value: string): string {
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
}

const EditTask = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { tasks, isLoading, updateTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const parsedTaskId = Number(taskId);
  const task = useMemo(
    () => tasks.find((entry) => entry.id === parsedTaskId) ?? null,
    [parsedTaskId, tasks],
  );

  if (isLoading) {
    return <p className="rounded-2xl bg-surface p-4 text-center">Loading task...</p>;
  }

  if (!task) {
    return <p className="rounded-2xl bg-surface p-4 text-center">Task not found.</p>;
  }

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
      await updateTask(task.id, {
        user_id: task.user_id,
        title: values.title,
        description: values.description,
        starts_at: values.startsAtIso,
        timezone: values.timezone,
        carry_over: values.carryOver,
        rrule: values.rrule,
        active: task.active,
      });
      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await updateTask(task.id, { active: false });
      navigate("/");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-center">
        <h2 className="text-4xl font-bold">Edit Task</h2>
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description,
            startsAt: toDateInputValue(task.starts_at),
            timezone: task.timezone,
            carryOver: task.carry_over,
            isRecurrent: Boolean(task.rrule),
          }}
          isSubmitting={isSubmitting || isDeleting}
          submitLabel="Save Changes"
          submittingLabel="Saving..."
          onSubmit={handleSubmit}
          extraActions={(
            <button
              type="button"
              className="calendar-navigation bg-primary! hover:bg-primary/80!"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Task"}
            </button>
          )}
        />
      </div>
    </div>
  );
};

export default EditTask;
