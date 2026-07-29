export type LogoVariant = "onBrand" | "onWhite";

export interface LogoProps {
  variant?: LogoVariant;
}

const VARIANT_CLASSES: Record<LogoVariant, string> = {
  onBrand: "text-white",
  onWhite: "text-brand",
};

export function Logo({ variant = "onBrand" }: LogoProps) {
  return (
    <span className={`text-2xl font-extrabold tracking-tight ${VARIANT_CLASSES[variant]}`}>Bidcom</span>
  );
}
