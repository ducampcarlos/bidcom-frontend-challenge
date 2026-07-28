import type { HTMLAttributes } from "react";

export type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-brand bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand ${className}`}
      {...props}
    />
  );
}
