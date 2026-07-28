import { formatPrice } from "@/lib/formatPrice";

export interface PriceProps {
  value: number;
  className?: string;
}

export function Price({ value, className = "" }: PriceProps) {
  return <span className={`font-bold tabular-nums ${className}`}>{formatPrice(value)}</span>;
}
