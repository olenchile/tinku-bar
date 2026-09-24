"use client";

import { ExperienceCanvas } from "@/components/wizard/experience-canvas";
import { StepSummary }      from "@/components/wizard/step-summary";

/**
 * Wizard — punto de entrada de la experiencia Tinku
 * Renderiza el canvas no lineal + el sheet de resumen.
 * Todo el estado vive en useExperienceStore (Zustand).
 */
export function Wizard() {
  return (
    <div className="relative w-full h-[100dvh] max-w-sm mx-auto overflow-hidden"
      style={{ background: "var(--color-obsidian)" }}>

      {/* Header fijo */}
      <header
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4 pb-3"
        style={{
          background: "linear-gradient(180deg, rgba(14,12,10,0.98) 0%, rgba(14,12,10,0.0) 100%)",
        }}
      >
        <div>
          <h1
            className="font-[var(--font-display)] text-[26px] font-light italic leading-none"
            style={{ color: "var(--color-cream)" }}
          >
            Tinku
          </h1>
          <p
            className="font-[var(--font-sans)] text-[7px] tracking-[0.45em] uppercase font-medium mt-0.5"
            style={{ color: "var(--color-gold-muted)" }}
          >
            Restobar · Experiencia
          </p>
        </div>

        {/* Línea dorada decorativa */}
        <div
          className="h-6 w-px"
          style={{ background: "linear-gradient(180deg, transparent, var(--color-gold), transparent)" }}
        />

        <p
          className="font-[var(--font-display)] text-[10px] italic"
          style={{ color: "var(--color-gold-muted)" }}
        >
          Nueva Extremadura #4402
        </p>
      </header>

      {/* Canvas principal — posición con top para dejar espacio al header */}
      <div className="absolute inset-0 pt-16">
        <ExperienceCanvas />
      </div>

      {/* Sheet de resumen (overlay global) */}
      <StepSummary />
    </div>
  );
}
