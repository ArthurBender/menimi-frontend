import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import FormField from "./FormField";

interface BaseTextFieldProps {
  id: string;
  label: string;
  requiredLabel?: boolean;
  multiline?: boolean;
}

type SingleLineTextFieldProps = BaseTextFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false;
  };

type MultiLineTextFieldProps = BaseTextFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
  };

type TextFieldProps = SingleLineTextFieldProps | MultiLineTextFieldProps;

const TextField = ({ id, label, requiredLabel = false, multiline = false, ...props }: TextFieldProps) => {
  return (
    <FormField id={id} label={label} required={requiredLabel}>
      {multiline ? (
        <textarea id={id} {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input id={id} {...(props as InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </FormField>
  );
};

export default TextField;
