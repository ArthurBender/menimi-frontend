import type { FormEvent, ReactNode } from "react";
import { useState } from "react";

import CheckboxField from "./custom-fields/CheckboxField";
import SelectField from "./custom-fields/SelectField";
import TextField from "./custom-fields/TextField";
import RRuleGenerator from "./RRuleGenerator";
import { showToast } from "../utils/toast";
import { timezoneOptions } from "../utils/timezones";

export interface TaskFormInitialValues {
  title: string;
  description: string;
  startsAt: string;
  timezone: string;
  carryOver: boolean;
  isRecurrent: boolean;
}

export interface TaskFormSubmitValues {
  title: string;
  description: string;
  startsAtIso: string;
  timezone: string;
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
  const [timezone, setTimezone] = useState(initialValues.timezone);

  const timezoneSelectOptions = timezoneOptions.map((timezoneOption) => ({
    value: timezoneOption.value,
    label: timezoneOption.label,
  }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const startsAtValue = String(formData.get("starts_at") ?? "");
    const startsAt = new Date(`${startsAtValue}T00:00:00`);

    if (Number.isNaN(startsAt.getTime())) {
      showToast("error", "Please provide a valid start date.");
      return;
    }

    await onSubmit({
      title,
      description: String(formData.get("description") ?? "").trim(),
      startsAtIso: startsAt.toISOString(),
      timezone,
      carryOver: formData.get("carry_over") === "on",
      rrule: isRecurrent ? String(formData.get("rrule") ?? "").trim() || null : null,
    });
  };

  return (
    <form className="flex flex-col gap-8 rounded-2xl bg-surface p-6" onSubmit={handleSubmit}>
      <TextField id="title" name="title" type="text" label="Title" defaultValue={initialValues.title} required requiredLabel />

      <TextField
        id="description"
        name="description"
        label="Description"
        rows={2}
        defaultValue={initialValues.description}
        multiline
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="starts_at"
          name="starts_at"
          type="date"
          defaultValue={initialValues.startsAt}
          label="Date / Starts At"
          required
          requiredLabel
        />

        <SelectField
          id="timezone"
          name="timezone"
          label="Timezone"
          requiredLabel
          value={timezone}
          options={timezoneSelectOptions}
          onChange={(value) => {
            if (value) setTimezone(value);
          }}
          isSearchable
          isDisabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CheckboxField
          id="recurrent"
          name="recurrent"
          checked={isRecurrent}
          onChange={(event) => setIsRecurrent(event.target.checked)}
          label="Recurrent"
        />

        <CheckboxField
          id="carry_over"
          name="carry_over"
          defaultChecked={initialValues.carryOver}
          label="Carry Over"
        />
      </div>

      {isRecurrent && <RRuleGenerator />}

      <div className="mt-2 flex justify-center gap-3">
        {extraActions}
        <button type="submit" className="calendar-navigation" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
