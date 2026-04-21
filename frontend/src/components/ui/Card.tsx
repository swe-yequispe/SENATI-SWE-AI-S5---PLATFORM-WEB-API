import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "article" | "section" | "div" | "li";
}

export const Card = ({ as = "div", className = "", ...props }: CardProps): JSX.Element => {
  const Tag = as;
  return <Tag className={`card-base ${className}`.trim()} {...props} />;
};
