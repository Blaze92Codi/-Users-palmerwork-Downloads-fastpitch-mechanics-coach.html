import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Format inches as a friendly imperial string, e.g. 13.5 -> 13 1/2" */
export function formatInches(value: number): string {
  const whole = Math.floor(value);
  const frac = value - whole;
  const eighths = Math.round(frac * 8);
  const fractions = ["", "1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8", ""];
  if (eighths === 8) return `${whole + 1}"`;
  if (eighths === 0) return `${whole}"`;
  return `${whole} ${fractions[eighths]}"`;
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
