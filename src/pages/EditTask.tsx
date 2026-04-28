import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageTitle from "../components/PageTitle";
import Panel from "../components/Panel";
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
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const parsedTaskId = Number(taskId);
  const task = useMemo(
    () => tasks.find((entry) => entry.id === parsedTaskId) ?? null,
    [parsedTaskId, tasks],
  );

  if (isLoading) {
    return <p className="rounded-2xl bg-surface p-4 text-center">{t("task.loading")}</p>;
  }

  if (!task) {
    return <p className="rounded-2xl bg-surface p-4 text-center">{t("task.notFound")}</p>;
  }

  const handleSubmit = async (values: {
    title: string;
    description: string;
    startsAtIso: string;
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
      <PageTitle title={t("task.editTitle")} description={t("task.editDescription")} />
      <Panel>
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description,
            startsAt: toDateInputValue(task.starts_at),
            carryOver: task.carry_over,
            isRecurrent: Boolean(task.rrule),
            rrule: task.rrule,
          }}
          isSubmitting={isSubmitting || isDeleting}
          submitLabel={t("common.saveChanges")}
          submittingLabel={t("common.saving")}
          onSubmit={handleSubmit}
          extraActions={(
            <button
              type="button"
              className="button bg-primary! hover:bg-primary/80!"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
            >
              {isDeleting ? t("task.deleting") : t("task.delete")}
            </button>
          )}
        />
      </Panel>
    </div>
  );
};

export default EditTask;
