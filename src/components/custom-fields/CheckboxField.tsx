import type { InputHTMLAttributes } from "react";

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
}

const CheckboxField = ({ id, label, className, ...props }: CheckboxFieldProps) => {
  return (
    <div className={className ?? "flex items-center gap-2"}>
      <input id={id} type="checkbox" {...props} />
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
    </div>
  );
};

export default CheckboxField;
