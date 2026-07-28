import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-full border border-line bg-white px-4 py-2 text-sm text-black placeholder:text-black/40 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${className}`}
      {...props}
    />
  );
}
