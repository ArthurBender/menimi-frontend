import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}

const FormField = ({ id, label, required = false, children }: FormFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className="task-field-group">
      <label htmlFor={id}>
        {required && <span title={t("common.required")}>*</span>} {label}
      </label>
      {children}
    </div>
  );
};

export default FormField;
