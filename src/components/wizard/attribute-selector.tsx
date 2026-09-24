"use client";

import { m, AnimatePresence } from "framer-motion";
import { Flame, Leaf, Wind, Star, Users, User, Zap, Wine, Coffee } from "lucide-react";
import type { MoodAttribute } from "@/types/wizard";
import { useExperienceStore } from "@/components/wizard/use-experience-store";

interface MoodConfig {
  id:       MoodAttribute;
  label:    string;
  sublabel: string;
  icon:     React.ReactNode;
  color:    string;
  glow:     string;
}

const MOODS: MoodConfig[] = [
  { id: "intenso",       label: "Intenso",       sublabel: "Sabores profundos",   icon: <Flame    className="w-5 h-5" />, color: "#b8732a", glow: "rgba(184,115,42,0.3)"  },
  { id: "suave",         label: "Suave",          sublabel: "Livianos y frescos",  icon: <Leaf     className="w-5 h-5" />, color: "#4a7a4a", glow: "rgba(74,122,74,0.3)"   },
  { id: "festivo",       label: "Festivo",        sublabel: "Para celebrar",       icon: <Star     className="w-5 h-5" />, color: "#c9a84c", glow: "rgba(201,168,76,0.3)"  },
  { id: "íntimo",        label: "Íntimo",         sublabel: "Momento especial",    icon: <Wind     className="w-5 h-5" />, color: "#8a5a88", glow: "rgba(138,90,136,0.3)"  },
  { id: "para_compartir",label: "Compartir",      sublabel: "En grupo, más sabor", icon: <Users    className="w-5 h-5" />, color: "#4a7a9a", glow: "rgba(74,122,154,0.3)"  },
  { id: "solo",          label: "Solo",           sublabel: "Mi momento personal", icon: <User     className="w-5 h-5" />, color: "#7a6a54", glow: "rgba(122,106,84,0.3)"  },
  { id: "con_alcohol",   label: "Con tragos",     sublabel: "Vinos, piscos, cocteles",icon: <Wine  className="w-5 h-5" />, color: "#5a1a38", glow: "rgba(90,26,56,0.5)"    },
  { id: "sin_alcohol",   label: "Sin alcohol",    sublabel: "Jugos, cafés, aguas", icon: <Coffee   className="w-5 h-5" />, color: "#6a4a2a", glow: "rgba(106,74,42,0.3)"   },
  { id: "rápido",        label: "Rápido",         sublabel: "Sin mucho tiempo",    icon: <Zap      className="w-5 h-5" />, color: "#4a8a5a", glow: "rgba(74,138,90,0.3)"   },
];

const cardVariant = {
  hidden:  { opacity: 0, scale: 0.88, y: 12 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 30, delay: i * 0.045 },
  }),
};

export function AttributeSelector() {
  const { selectedMoods, toggleMood } = useExperienceStore();

  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="mb-4 px-1">
        <p className="font-[var(--font-display)] text-[11px] tracking-[0.35em] uppercase text-[var(--color-gold-muted)]">
          Cuéntanos tu estado de ánimo
        </p>
        <h2
          className="font-[var(--font-display)] text-3xl font-light italic leading-tight mt-1"
          style={{ color: "var(--color-cream)" }}
        >
          ¿Qué estás<br />
          <span className="shimmer-gold font-semibold">buscando hoy?</span>
        </h2>
        {selectedMoods.length > 0 && (
          <m.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[var(--font-sans)] text-[11px] text-[var(--color-gold)] mt-2"
          >
            {selectedMoods.length} {selectedMoods.length === 1 ? "atributo" : "atributos"} seleccionados · El menú se adapta automáticamente
          </m.p>
        )}
      </div>

      {/* Grid de moods */}
      <div className="grid grid-cols-3 gap-2">
        {MOODS.map((mood, i) => {
          const active = selectedMoods.includes(mood.id);
          return (
            <m.button
              key={mood.id}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              whileTap={{ scale: 0.90 }}
              onClick={() => toggleMood(mood.id)}
              className="relative flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-center transition-all overflow-hidden"
              style={{
                background: active
                  ? `linear-gradient(135deg, ${mood.color}30, ${mood.color}18)`
                  : "rgba(26,23,20,0.8)",
                border: `1px solid ${active ? mood.color : "rgba(201,168,76,0.12)"}`,
                boxShadow: active ? `0 0 20px ${mood.glow}, inset 0 0 20px ${mood.color}08` : "none",
              }}
            >
              {/* Glow de fondo al activar */}
              {active && (
                <m.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${mood.color}15 0%, transparent 70%)`,
                  }}
                />
              )}

              {/* Ícono */}
              <div
                className="transition-colors"
                style={{ color: active ? mood.color : "var(--color-ink-muted)" }}
              >
                {mood.icon}
              </div>

              <div>
                <p
                  className="font-[var(--font-sans)] text-[11px] font-semibold leading-tight transition-colors"
                  style={{ color: active ? mood.color : "var(--color-ink)" }}
                >
                  {mood.label}
                </p>
                <p className="font-[var(--font-sans)] text-[9px] leading-tight mt-0.5 text-[var(--color-ink-subtle)]">
                  {mood.sublabel}
                </p>
              </div>

              {/* Indicador activo */}
              <AnimatePresence>
                {active && (
                  <m.div
                    key="dot"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring" as const, stiffness: 500, damping: 20 }}
                    className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: mood.color }}
                  />
                )}
              </AnimatePresence>
            </m.button>
          );
        })}
      </div>
    </div>
  );
}
