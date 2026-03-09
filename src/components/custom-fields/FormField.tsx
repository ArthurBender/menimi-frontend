import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}

const FormField = ({ id, label, required = false, children }: FormFieldProps) => {
  return (
    <div className="task-field-group">
      <label htmlFor={id}>
        {required && <span title="required">*</span>} {label}
      </label>
      {children}
    </div>
  );
};

export default FormField;
