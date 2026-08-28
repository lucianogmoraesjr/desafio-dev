import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyFormatter = {
  format: (value: number) => {
    if (value === null || Number.isNaN(value)) return "";

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  },

  parse: (value: string) => {
    const normalizedValue = value.replace(/[.,]/g, "");
    if (Number.isNaN(normalizedValue)) return 0;
    return parseInt(normalizedValue);
  },
};

export function dateFormatter(date: Date) {
  return Intl.DateTimeFormat("pt-BR").format(date);
}
