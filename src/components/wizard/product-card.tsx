"use client";

import { m, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Check } from "lucide-react";
import { menuData, formatPrice, type MenuSectionId } from "@/data/menu";
import { useExperienceStore } from "@/components/wizard/use-experience-store";
import type { AffinityScore } from "@/types/wizard";

interface ProductCardProps {
  score:    AffinityScore;
  compact?: boolean;
}

function AffinityRing({ value, color }: { value: number; color: string }) {
  const r   = 18;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      {/* Track */}
      <circle cx="22" cy="22" r={r} fill="none"
        strokeWidth="2.5" stroke="rgba(201,168,76,0.12)" />
      {/* Progress */}
      <circle cx="22" cy="22" r={r} fill="none"
        strokeWidth="2.5"
        stroke={color}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
      />
      {/* Label */}
      <text x="22" y="26" textAnchor="middle"
        fill={color} fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">
        {value}
      </text>
    </svg>
  );
}

export function ProductCard({ score, compact = false }: ProductCardProps) {
  const { addItem, removeItem, cart } = useExperienceStore();

  const section = menuData[score.itemId.split("-")[0] as MenuSectionId];
  const itemName = score.itemId.slice(score.itemId.indexOf("-") + 1);
  if (!section) return null;

  const item    = section.items.find((i) => i.name === itemName);
  if (!item) return null;

  const inCart  = cart.find((c) => c.id === score.itemId);
  const accentColor = score.badge?.color ?? section.accent;

  const handleAdd = () => {
    if (inCart) {
      removeItem(score.itemId);
    } else {
      addItem({
        id: score.itemId,
        sectionId: section.id,
        name: item.name,
        price: item.price,
        qty: 1,
        group: section.group,
        isRecommended: true,
      });
    }
  };

  if (compact) {
    return (
      <m.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring" as const, stiffness: 340, damping: 26 }}
        className="relative flex items-center gap-3 p-3 rounded-xl border"
        style={{
          background: "rgba(26,23,20,0.9)",
          borderColor: inCart ? accentColor : "rgba(201,168,76,0.14)",
          boxShadow: inCart ? `0 0 16px ${accentColor}33` : "none",
        }}
      >
        {/* Score ring */}
        <AffinityRing value={score.total} color={accentColor} />

        <div className="flex-1 min-w-0">
          <p className="font-[var(--font-sans)] text-[12px] font-semibold text-[var(--color-ink)] leading-tight truncate">
            {item.name}
          </p>
          <p className="font-[var(--font-sans)] text-[10px] text-[var(--color-ink-muted)] mt-0.5 truncate">
            {score.headline}
          </p>
          <p className="font-[var(--font-sans)] text-[11px] font-bold tabular-nums mt-1"
            style={{ color: accentColor }}>
            {formatPrice(item.price)}
          </p>
        </div>

        <m.button
          whileTap={{ scale: 0.82 }}
          onClick={handleAdd}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
          style={{
            backgroundColor: inCart ? accentColor : `${accentColor}22`,
            color: inCart ? "#0e0c0a" : accentColor,
          }}
        >
          {inCart ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />}
        </m.button>
      </m.div>
    );
  }

  /* Tarjeta editorial completa */
  return (
    <m.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: "spring" as const, stiffness: 320, damping: 28 }}
      className="relative flex flex-col rounded-2xl overflow-hidden border"
      style={{
        background: "linear-gradient(160deg, rgba(30,26,22,0.98) 0%, rgba(20,18,14,0.98) 100%)",
        borderColor: inCart ? accentColor : "rgba(201,168,76,0.18)",
        boxShadow: inCart
          ? `0 0 32px ${accentColor}44, 0 4px 24px rgba(0,0,0,0.5)`
          : "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Color accent bar superior */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

      {/* Header con score + badge */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
        <div className="flex-1 min-w-0">
          {score.badge && (
            <m.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full mb-2"
              style={{ backgroundColor: `${score.badge.color}20`, color: score.badge.color, border: `1px solid ${score.badge.color}44` }}
            >
              <Sparkles className="w-2 h-2" />
              {score.badge.label}
            </m.span>
          )}
          <h3 className="font-[var(--font-serif)] text-[15px] font-semibold italic text-[var(--color-cream)] leading-snug">
            {item.name}
          </h3>
        </div>

        <AffinityRing value={score.total} color={accentColor} />
      </div>

      {/* Descripción editorial */}
      <div className="px-4 pb-3">
        <p className="font-[var(--font-sans)] text-[11px] italic text-[var(--color-gold-muted)] leading-relaxed">
          {score.why}
        </p>
        {item.description && (
          <p className="font-[var(--font-sans)] text-[10px] text-[var(--color-ink-subtle)] mt-1 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Dimensiones de score */}
      <div className="px-4 pb-3 grid grid-cols-5 gap-1">
        {(Object.entries(score.dimensions) as [string, number][]).map(([dim, val]) => (
          <div key={dim} className="flex flex-col items-center gap-1">
            <div className="w-full h-0.5 rounded-full overflow-hidden bg-[rgba(201,168,76,0.10)]">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: accentColor, opacity: 0.7 }}
              />
            </div>
            <span className="font-[var(--font-sans)] text-[8px] text-[var(--color-ink-subtle)] capitalize tracking-wide">
              {dim.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer: precio + CTA */}
      <div className="flex items-center justify-between px-4 py-3 mt-auto border-t border-[rgba(201,168,76,0.10)]">
        <span
          className="font-[var(--font-display)] text-[20px] font-light tabular-nums"
          style={{ color: accentColor }}
        >
          {formatPrice(item.price)}
        </span>

        <m.button
          whileTap={{ scale: 0.88 }}
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-[var(--font-sans)] text-[11px] font-bold transition-all"
          style={inCart
            ? { backgroundColor: accentColor, color: "#0e0c0a" }
            : { backgroundColor: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}44` }
          }
        >
          {inCart ? (
            <><Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Agregado ({inCart.qty})</>
          ) : (
            <><Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Agregar</>
          )}
        </m.button>
      </div>
    </m.article>
  );
}
