import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = ({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps): JSX.Element => {
  const variantClass = variant === "primary" ? "btn-primary" : "btn-secondary";

  return <button className={`${variantClass} ${className}`.trim()} {...props} />;
};
