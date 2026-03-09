import Select from "react-select";
import type { SingleValue } from "react-select";

import FormField from "./FormField";

export interface SelectOption<TValue extends string | number> {
  value: TValue;
  label: string;
  isDisabled?: boolean;
}

interface SelectFieldProps<TValue extends string | number> {
  id: string;
  label: string;
  requiredLabel?: boolean;
  name?: string;
  value: TValue | null;
  options: Array<SelectOption<TValue>>;
  onChange: (value: TValue | null) => void;
  isSearchable?: boolean;
  isDisabled?: boolean;
}

const SelectField = <TValue extends string | number>({
  id,
  label,
  requiredLabel = false,
  name,
  value,
  options,
  onChange,
  isSearchable = false,
  isDisabled = false,
}: SelectFieldProps<TValue>) => {
  const selectedOption = options.find((option) => option.value === value) ?? null;

  const handleChange = (selected: SingleValue<SelectOption<TValue>>) => {
    onChange(selected?.value ?? null);
  };

  return (
    <FormField id={id} label={label} required={requiredLabel}>
      <Select<SelectOption<TValue>, false>
        inputId={id}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        classNamePrefix="react-select"
      />
      {name && value !== null && <input type="hidden" name={name} value={String(value)} />}
    </FormField>
  );
};

export default SelectField;
