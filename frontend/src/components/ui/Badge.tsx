import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "success" | "warning";
}

export const Badge = ({ variant = "neutral", className = "", ...props }: BadgeProps): JSX.Element => {
  const variantClass =
    variant === "success" ? "badge-success" : variant === "warning" ? "badge-warning" : "badge-neutral";

  return <span className={`${variantClass} ${className}`.trim()} {...props} />;
};
