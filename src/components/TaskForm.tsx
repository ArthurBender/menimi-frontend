import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import CheckboxField from "./custom-fields/CheckboxField";
import TextField from "./custom-fields/TextField";
import RRuleGenerator from "./RRuleGenerator";
import { showToast } from "../utils/toast";

export interface TaskFormInitialValues {
  title: string;
  description: string;
  startsAt: string;
  carryOver: boolean;
  isRecurrent: boolean;
  rrule?: string | null;
}

export interface TaskFormSubmitValues {
  title: string;
  description: string;
  startsAtIso: string;
  carryOver: boolean;
  rrule: string | null;
}

interface TaskFormProps {
  initialValues: TaskFormInitialValues;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (values: TaskFormSubmitValues) => Promise<void>;
  extraActions?: ReactNode;
}

const TaskForm = ({
  initialValues,
  isSubmitting,
  submitLabel,
  submittingLabel,
  onSubmit,
  extraActions,
}: TaskFormProps) => {
  const [isRecurrent, setIsRecurrent] = useState(initialValues.isRecurrent);
  const { t } = useTranslation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const startsAtValue = String(formData.get("starts_at") ?? "");
    const startsAt = new Date(`${startsAtValue}T00:00:00`);

    if (Number.isNaN(startsAt.getTime())) {
      showToast("error", t("validation.invalidStartDate"));
      return;
    }

    await onSubmit({
      title,
      description: String(formData.get("description") ?? "").trim(),
      startsAtIso: startsAt.toISOString(),
      carryOver: formData.get("carry_over") === "on",
      rrule: isRecurrent ? String(formData.get("rrule") ?? "").trim() || null : null,
    });
  };

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={handleSubmit}>
      <TextField
        id="title"
        name="title"
        type="text"
        label={t("common.title")}
        defaultValue={initialValues.title}
        required
        requiredLabel
      />

      <TextField
        id="description"
        name="description"
        label={t("task.description")}
        rows={2}
        defaultValue={initialValues.description}
        multiline
      />

      <TextField
        id="starts_at"
        name="starts_at"
        type="date"
        defaultValue={initialValues.startsAt}
        label={t("task.startsAt")}
        required
        requiredLabel
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CheckboxField
          id="recurrent"
          name="recurrent"
          checked={isRecurrent}
          onChange={(event) => setIsRecurrent(event.target.checked)}
          label={t("task.recurrent")}
        />

        <CheckboxField
          id="carry_over"
          name="carry_over"
          defaultChecked={initialValues.carryOver}
          label={t("task.carryOver")}
        />
      </div>

      {isRecurrent && <RRuleGenerator initialRRule={initialValues.rrule} />}

      <div className="mt-2 flex justify-center gap-3">
        {extraActions}
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
