import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = ({ className = "", ...props }: TextInputProps): JSX.Element => {
  return <input className={`input-base ${className}`.trim()} {...props} />;
};
