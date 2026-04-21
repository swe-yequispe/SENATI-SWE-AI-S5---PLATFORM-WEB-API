import type { HTMLAttributes } from "react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "error" | "info" | "success";
}

export const Alert = ({ variant = "error", className = "", ...props }: AlertProps): JSX.Element => {
  const variantClass =
    variant === "success" ? "alert-success" : variant === "info" ? "alert-info" : "alert-error";
  return <div role="alert" className={`${variantClass} ${className}`.trim()} {...props} />;
};
