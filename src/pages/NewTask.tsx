import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageTitle from "../components/PageTitle";
import Panel from "../components/Panel";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../api/useAuth";
import { useTasks } from "../api/useTasks";

function getCurrentLocalDate() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

function getInitialStartsAt(value: string | null) {
  if (!value) return getCurrentLocalDate();

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return getCurrentLocalDate();

  const offsetMs = parsed.getTimezoneOffset() * 60 * 1000;
  return new Date(parsed.getTime() - offsetMs).toISOString().slice(0, 10);
}

const NewTask = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { createTask } = useTasks();
  const initialStartsAt = getInitialStartsAt(searchParams.get("occurredAt"));

  const handleSubmit = async (values: {
    title: string;
    description: string;
    startsAtIso: string;
    carryOver: boolean;
    rrule: string | null;
  }) => {
    setIsSubmitting(true);

    try {
      await createTask({
        user_id: user?.id,
        title: values.title,
        description: values.description,
        rrule: values.rrule,
        starts_at: values.startsAtIso,
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
      <PageTitle title={t("task.newTitle")} description={t("task.newDescription")} />
      <Panel>
        <TaskForm
          initialValues={{
            title: "",
            description: "",
            startsAt: initialStartsAt,
            carryOver: false,
            isRecurrent: false,
          }}
          isSubmitting={isSubmitting}
          submitLabel={t("task.create")}
          submittingLabel={t("task.creating")}
          onSubmit={handleSubmit}
        />
      </Panel>
    </div>
  );
}

export default NewTask
