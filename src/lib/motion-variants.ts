/**
 * Variantes de animación compartidas — Framer Motion v13
 * Usa `as const` para satisfacer el tipo AnimationGeneratorType.
 */
import type { Variants } from "framer-motion";

export const pageEnter: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0,
    transition: { type: "spring" as const, stiffness: 340, damping: 30 } },
  exit:    { opacity: 0, x: -28,
    transition: { type: "spring" as const, stiffness: 340, damping: 30 } },
};

export const listEnter: Variants = {
  hidden:  { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 32 } },
  exit:    { opacity: 0, x: -24,
    transition: { type: "spring" as const, stiffness: 380, damping: 32 } },
};

export const staggerContainer: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1,
    transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
  exit:    { opacity: 0 },
};

export const cardSpring: Variants = {
  hidden:  { opacity: 0, y: 20, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 28 } },
};
