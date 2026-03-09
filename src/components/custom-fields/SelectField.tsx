import type { ReactNode, SelectHTMLAttributes } from "react";

import FormField from "./FormField";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  requiredLabel?: boolean;
  children: ReactNode;
}

const SelectField = ({ id, label, requiredLabel = false, children, ...props }: SelectFieldProps) => {
  return (
    <FormField id={id} label={label} required={requiredLabel}>
      <select id={id} {...props}>
        {children}
      </select>
    </FormField>
  );
};

export default SelectField;
