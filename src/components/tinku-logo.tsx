"use client";

import React from "react";
import { m, useReducedMotion } from "framer-motion";

// ─── Props ────────────────────────────────────────────────────────────────────
interface TinkuLogoProps {
  /** Ancho en px. Alto se calcula automáticamente (aspect ratio 1024:683) */
  size?: number;
  /** Si true, no anima — solo renderiza estático */
  static?: boolean;
  /**
   * Invierte el color del logo para usarlo sobre fondos oscuros.
   * El SVG original tiene fill:#191c2c (casi negro), por lo que sobre
   * fondos oscuros se debe invertir para que aparezca blanco/crema.
   */
  invert?: boolean;
  /** Clase CSS adicional */
  className?: string;
  /** Callback al hacer click */
  onClick?: () => void;
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function TinkuLogo({
  size = 200,
  static: isStatic = false,
  invert = false,
  className = "",
  onClick,
}: TinkuLogoProps) {
  const prefersReduced = useReducedMotion();
  // Aspect ratio del SVG real: 1024 × 683
  const height = Math.round(size * (683 / 1024));

  const imgFilter = invert
    ? "invert(1) brightness(1.05) sepia(0.15)"
    : "none";

  return (
    <m.div
      className={`inline-flex items-center justify-center select-none ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ width: size, height }}
      animate={
        !isStatic && !prefersReduced
          ? { y: [0, -5, 0] }
          : undefined
      }
      transition={
        !isStatic && !prefersReduced
          ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
    >
      <m.div
        animate={
          !isStatic && !prefersReduced
            ? {
                filter: invert
                  ? [
                      "drop-shadow(0 0 0px transparent) invert(1) brightness(1.05) sepia(0.15)",
                      "drop-shadow(0 0 10px rgba(245,208,100,0.4)) invert(1) brightness(1.05) sepia(0.15)",
                      "drop-shadow(0 0 0px transparent) invert(1) brightness(1.05) sepia(0.15)",
                    ]
                  : [
                      "drop-shadow(0 0 0px transparent)",
                      "drop-shadow(0 0 10px rgba(217,119,6,0.35))",
                      "drop-shadow(0 0 0px transparent)",
                    ],
              }
            : undefined
        }
        transition={
          !isStatic && !prefersReduced
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo_tinku2026_clean.svg"
          alt="Restobar Tinku"
          width={size}
          height={height}
          style={{
            width: size,
            height,
            objectFit: "contain",
            display: "block",
            filter: imgFilter,
            transition: "filter 0.3s ease",
          }}
        />
      </m.div>
    </m.div>
  );
}

export default TinkuLogo;
