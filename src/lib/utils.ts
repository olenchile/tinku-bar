import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — Clase helper para combinar Tailwind classes + clsx
 * Permite override limpio sin conflictos de utilidades.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
