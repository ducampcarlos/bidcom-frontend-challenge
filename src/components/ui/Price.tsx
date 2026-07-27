import { formatPrice } from "@/lib/formatPrice";

export interface PriceProps {
  value: number;
  className?: string;
}

export function Price({ value, className = "" }: PriceProps) {
  return <span className={`font-semibold ${className}`}>{formatPrice(value)}</span>;
}
