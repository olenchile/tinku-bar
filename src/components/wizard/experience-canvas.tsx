"use client";

import { useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight, Sparkles, BookOpen } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { menuData } from "@/data/menu";
import { CategoryIcon } from "@/components/category-icon";
import { AttributeSelector } from "@/components/wizard/attribute-selector";
import { ProductCard } from "@/components/wizard/product-card";
import { MenuExplorer } from "@/components/wizard/menu-explorer";
import { useExperienceStore } from "@/components/wizard/use-experience-store";

/* ── Variante cinematográfica de entrada ── */
const heroVariant = {
  initial: { opacity: 0, y: 32, scale: 0.98 },
  animate: { opacity: 1, y: 0,  scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 26, delay: 0.1 } },
};

const secStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055 } },
};
const secCard = {
  hidden:  { opacity: 0, y: 14, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { type: "spring" as const, stiffness: 360, damping: 30 } },
};

/* ── Sección de categorías para el canvas ── */
const ALL_SECTIONS = Object.values(menuData);
const FOOD_SECTIONS  = ALL_SECTIONS.filter((s) => s.group === "food");
const DRINK_SECTIONS = ALL_SECTIONS.filter((s) => s.group === "drinks");

export function ExperienceCanvas() {
  const {
    selectedMoods, panel, activeSection,
    cartCount, topRecs, setActiveSection, setPanel, toggleSummary,
    recalculate,
  } = useExperienceStore();

  const count      = cartCount();
  const recs       = topRecs();
  const hasRecs    = recs.length > 0;

  /* Calcular afinidad inicial */
  useEffect(() => { recalculate(); }, [recalculate]);

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: "var(--color-obsidian)" }}>

      <AnimatePresence mode="wait">

        {/* ── EXPLORER (sección específica) ── */}
        {panel === "explorer" && activeSection && (
          <MenuExplorer
            key="explorer"
            sectionId={activeSection}
            onClose={() => setActiveSection(null)}
          />
        )}

        {/* ── CANVAS PRINCIPAL ── */}
        {panel === "canvas" && (
          <m.div
            key="canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col"
          >
            <ScrollArea.Root className="flex-1 overflow-hidden">
              <ScrollArea.Viewport className="h-full w-full">
                <div className="px-5 pt-5 pb-28 flex flex-col gap-6">

                  {/* ── Selector de Mood ── */}
                  <m.div variants={heroVariant} initial="initial" animate="animate">
                    <AttributeSelector />
                  </m.div>

                  {/* ── Recomendaciones del engine ── */}
                  <AnimatePresence mode="wait">
                    {hasRecs && (
                      <m.section
                        key="recs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring" as const, stiffness: 300, damping: 28 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)" }}>
                            <Sparkles className="w-3 h-3" style={{ color: "var(--color-gold)" }} />
                          </div>
                          <div>
                            <p className="font-[var(--font-display)] text-[10px] tracking-[0.3em] uppercase"
                              style={{ color: "var(--color-gold-muted)" }}>
                              Curado para ti
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          {recs.slice(0, 3).map((score) => (
                            <ProductCard key={score.itemId} score={score} />
                          ))}
                        </div>

                        {recs.length > 3 && (
                          <button
                            onClick={() => setPanel("explorer")}
                            className="w-full mt-2 py-2.5 rounded-xl font-[var(--font-sans)] text-[11px] font-medium flex items-center justify-center gap-1.5"
                            style={{
                              color: "var(--color-gold-muted)",
                              border: "1px solid rgba(201,168,76,0.12)",
                              background: "rgba(201,168,76,0.04)",
                            }}
                          >
                            Ver {recs.length - 3} más
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </m.section>
                    )}
                  </AnimatePresence>

                  {/* ── Explorar por categorías — COMIDA ── */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--color-gold-muted)" }} />
                      <p className="font-[var(--font-display)] text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: "var(--color-gold-muted)" }}>
                        Explorar — Comida
                      </p>
                    </div>

                    <m.div
                      variants={secStagger}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-3 gap-2.5"
                    >
                      {FOOD_SECTIONS.map((sec) => {
                        const cartQty = useExperienceStore.getState().cart
                          .filter((c) => c.sectionId === sec.id)
                          .reduce((a, b) => a + b.qty, 0);
                        return (
                          <m.button
                            key={sec.id}
                            variants={secCard}
                            whileTap={{ scale: 0.90 }}
                            onClick={() => setActiveSection(sec.id)}
                            className="relative flex flex-col items-center gap-2 px-2 py-3.5 rounded-xl overflow-hidden text-center"
                            style={{
                              background: "rgba(26,23,20,0.95)",
                              border: `1px solid ${cartQty > 0 ? sec.accent : "rgba(201,168,76,0.10)"}`,
                              boxShadow: cartQty > 0 ? `0 0 16px ${sec.accent}28` : "none",
                            }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-0.5"
                              style={{ background: `linear-gradient(90deg, transparent, ${sec.accent}, transparent)` }} />

                            {cartQty > 0 && (
                              <m.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" as const, stiffness: 500 }}
                                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                                style={{ backgroundColor: sec.accent, color: "#0e0c0a" }}
                              >
                                {cartQty}
                              </m.span>
                            )}

                            <CategoryIcon emoji={sec.emoji} size={40} alt={sec.title} className="drop-shadow-sm" />
                            <span className="font-[var(--font-sans)] text-[9px] font-semibold leading-tight"
                              style={{ color: cartQty > 0 ? sec.accent : "var(--color-ink-muted)" }}>
                              {sec.title}
                            </span>
                          </m.button>
                        );
                      })}
                    </m.div>
                  </section>

                  {/* ── Explorar por categorías — BEBIDAS ── */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--color-gold-muted)" }} />
                      <p className="font-[var(--font-display)] text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: "var(--color-gold-muted)" }}>
                        Explorar — Bebidas
                      </p>
                    </div>

                    <m.div
                      variants={secStagger}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-3 gap-2.5"
                    >
                      {DRINK_SECTIONS.map((sec) => {
                        const cartQty = useExperienceStore.getState().cart
                          .filter((c) => c.sectionId === sec.id)
                          .reduce((a, b) => a + b.qty, 0);
                        return (
                          <m.button
                            key={sec.id}
                            variants={secCard}
                            whileTap={{ scale: 0.90 }}
                            onClick={() => setActiveSection(sec.id)}
                            className="relative flex flex-col items-center gap-2 px-2 py-3.5 rounded-xl overflow-hidden text-center"
                            style={{
                              background: "rgba(26,23,20,0.95)",
                              border: `1px solid ${cartQty > 0 ? sec.accent : "rgba(201,168,76,0.10)"}`,
                              boxShadow: cartQty > 0 ? `0 0 16px ${sec.accent}28` : "none",
                            }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-0.5"
                              style={{ background: `linear-gradient(90deg, transparent, ${sec.accent}, transparent)` }} />

                            {cartQty > 0 && (
                              <m.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" as const, stiffness: 500 }}
                                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                                style={{ backgroundColor: sec.accent, color: "#0e0c0a" }}
                              >
                                {cartQty}
                              </m.span>
                            )}

                            <CategoryIcon emoji={sec.emoji} size={40} alt={sec.title} className="drop-shadow-sm" />
                            <span className="font-[var(--font-sans)] text-[9px] font-semibold leading-tight"
                              style={{ color: cartQty > 0 ? sec.accent : "var(--color-ink-muted)" }}>
                              {sec.title}
                            </span>
                          </m.button>
                        );
                      })}
                    </m.div>
                  </section>

                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar orientation="vertical"
                className="flex select-none touch-none p-0.5 w-1">
                <ScrollArea.Thumb className="flex-1 rounded-full"
                  style={{ backgroundColor: "rgba(201,168,76,0.2)" }} />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>

            {/* ── FAB carrito ── */}
            <AnimatePresence>
              {count > 0 && (
                <m.button
                  key="fab"
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7, y: 20 }}
                  transition={{ type: "spring" as const, stiffness: 480, damping: 26 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={toggleSummary}
                  className="fixed bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3.5 rounded-full shadow-2xl z-30"
                  style={{
                    background: "linear-gradient(135deg, #c9a84c 0%, #e4c068 100%)",
                    boxShadow: "0 8px 32px rgba(201,168,76,0.45), 0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  <ShoppingBag className="w-4 h-4 text-[#0e0c0a]" strokeWidth={2.5} />
                  <span className="font-[var(--font-sans)] text-[12px] font-bold text-[#0e0c0a]">
                    Ver mi pedido
                  </span>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]"
                    style={{ backgroundColor: "#0e0c0a", color: "#c9a84c" }}
                  >
                    {count}
                  </span>
                </m.button>
              )}
            </AnimatePresence>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
