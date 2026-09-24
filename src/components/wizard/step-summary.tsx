"use client";

import type { ExperienceCartItem } from "@/types/wizard";
import { m, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, MessageCircle, RotateCcw, X,
  Trash2, Minus, Plus, ChevronRight
} from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator  from "@radix-ui/react-separator";
import { menuData, formatPrice, type MenuSectionId } from "@/data/menu";
import { CategoryIcon } from "@/components/category-icon";
import { useExperienceStore } from "@/components/wizard/use-experience-store";

const WHATSAPP = "56912345678"; // ← reemplazar con número real

function buildWA(cart: ExperienceCartItem[]): string {
  const lines = cart.map((i: ExperienceCartItem) => `• ${i.qty}x ${i.name}`);
  return encodeURIComponent(`Hola Tinku! Mi pedido:\n${lines.join("\n")}`);
}

const slideUp = {
  hidden:  { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
  exit:    { opacity: 0, y: "100%",
    transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

const itemAnim = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto",
    transition: { type: "spring" as const, stiffness: 300, damping: 28 } },
  exit:    { opacity: 0, height: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 28 } },
};

export function StepSummary() {
  const { cart, cartTotal, cartCount, incrementItem, decrementItem, removeItem, resetCart, summaryOpen, toggleSummary } = useExperienceStore();

  const total = cartTotal();
  const count = cartCount();
  const waUrl = `https://wa.me/${WHATSAPP}?text=${buildWA(cart)}`;

  return (
    <AnimatePresence>
      {summaryOpen && (
        <>
          {/* Overlay */}
          <m.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(14,12,10,0.75)", backdropFilter: "blur(4px)" }}
            onClick={toggleSummary}
          />

          {/* Sheet */}
          <m.div
            key="sheet"
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-50 flex flex-col rounded-t-3xl overflow-hidden"
            style={{
              background: "var(--color-charcoal)",
              border: "1px solid var(--color-gold-border)",
              borderBottom: "none",
              maxHeight: "88dvh",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.10)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "rgba(201,168,76,0.25)" }} />
            </div>

            {/* Hero "Muéstrale al garzón" */}
            <div className="shrink-0 px-5 pb-4 pt-2">
              <m.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" as const, stiffness: 280, damping: 24, delay: 0.08 }}
                className="relative rounded-2xl overflow-hidden px-5 py-4 flex items-center gap-4"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(184,115,42,0.10) 100%)",
                  border: "1px solid rgba(201,168,76,0.28)",
                }}
              >
                {/* Glow decorativo */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

                <m.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 22, delay: 0.18 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.30)" }}
                >
                  <CheckCircle2 className="w-6 h-6" style={{ color: "var(--color-gold)" }} />
                </m.div>

                <div className="flex-1 min-w-0">
                  <p className="font-[var(--font-display)] text-[18px] font-semibold italic"
                    style={{ color: "var(--color-cream)" }}>
                    Muéstrale al garzón
                  </p>
                  <p className="font-[var(--font-sans)] text-[10px] tracking-wider"
                    style={{ color: "var(--color-gold-muted)" }}>
                    {count} {count === 1 ? "ítem" : "ítems"} · {formatPrice(total)} estimado
                  </p>
                </div>

                <button onClick={toggleSummary} className="p-1 shrink-0">
                  <X className="w-4 h-4" style={{ color: "var(--color-ink-subtle)" }} />
                </button>
              </m.div>
            </div>

            <Separator.Root decorative className="mx-5 h-px"
              style={{ backgroundColor: "rgba(201,168,76,0.10)" }} />

            {/* Lista del carrito */}
            <ScrollArea.Root className="flex-1 overflow-hidden">
              <ScrollArea.Viewport className="h-full w-full">
                <div className="px-5 py-3">
                  {cart.length === 0 ? (
                    <div className="py-8 flex flex-col items-center gap-3">
                      <p className="font-[var(--font-serif)] text-sm italic"
                        style={{ color: "var(--color-ink-muted)" }}>
                        Tu experiencia está en blanco
                      </p>
                      <p className="font-[var(--font-sans)] text-[11px]"
                        style={{ color: "var(--color-ink-subtle)" }}>
                        Explora el menú y agrega lo que deseas
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {cart.map((item, idx) => {
                        const sec    = menuData[item.sectionId as MenuSectionId];
                        const isLast = idx === cart.length - 1;
                        return (
                          <m.div key={item.id} variants={itemAnim} initial="hidden" animate="visible" exit="exit">
                            <div className="flex items-center gap-3 py-3">
                              <div className="relative shrink-0">
                                {sec && <CategoryIcon emoji={sec.emoji} size={30} alt={sec.title} />}
                                {item.isRecommended && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: "var(--color-gold)" }}>
                                    <span className="text-[5px] text-[#0e0c0a] font-bold">★</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-[var(--font-serif)] text-[12px] italic text-[var(--color-cream)] leading-snug truncate">
                                  {item.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="font-[var(--font-display)] text-[13px] font-light tabular-nums"
                                    style={{ color: sec?.accent ?? "var(--color-gold)" }}>
                                    {item.price !== null ? formatPrice((item.price ?? 0) * item.qty) : "Consultar"}
                                  </p>
                                  {item.affinityScore && item.affinityScore >= 80 && (
                                    <span className="font-[var(--font-sans)] text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: "rgba(201,168,76,0.12)",
                                        color: "var(--color-gold-muted)",
                                        border: "1px solid rgba(201,168,76,0.20)",
                                      }}>
                                      {item.affinityScore}% afinidad
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Controles qty */}
                              <div className="flex items-center gap-1 shrink-0">
                                <m.button whileTap={{ scale: 0.82 }} onClick={() => decrementItem(item.id)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ background: "rgba(201,168,76,0.10)", color: "var(--color-gold-muted)" }}>
                                  <Minus className="w-3 h-3" />
                                </m.button>
                                <span className="font-[var(--font-sans)] text-[12px] font-bold w-5 text-center"
                                  style={{ color: "var(--color-cream)" }}>
                                  {item.qty}
                                </span>
                                <m.button whileTap={{ scale: 0.82 }} onClick={() => incrementItem(item.id)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ background: "rgba(201,168,76,0.10)", color: "var(--color-gold-muted)" }}>
                                  <Plus className="w-3 h-3" />
                                </m.button>
                                <m.button whileTap={{ scale: 0.82 }} onClick={() => removeItem(item.id)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center ml-1"
                                  style={{ background: "rgba(200,50,50,0.10)", color: "#c85050" }}>
                                  <Trash2 className="w-3 h-3" />
                                </m.button>
                              </div>
                            </div>

                            {!isLast && (
                              <Separator.Root decorative className="h-px"
                                style={{ backgroundColor: "rgba(201,168,76,0.07)" }} />
                            )}
                          </m.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 w-1">
                <ScrollArea.Thumb className="flex-1 rounded-full" style={{ backgroundColor: "rgba(201,168,76,0.2)" }} />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>

            {/* Footer acciones */}
            {cart.length > 0 && (
              <div className="shrink-0 px-5 pt-3 pb-6 flex flex-col gap-2.5"
                style={{ borderTop: "1px solid rgba(201,168,76,0.10)" }}>

                <div className="flex items-baseline justify-between px-1">
                  <span className="font-[var(--font-sans)] text-[11px]"
                    style={{ color: "var(--color-ink-muted)" }}>
                    Total estimado
                  </span>
                  <span className="font-[var(--font-display)] text-3xl font-light tabular-nums"
                    style={{ color: "var(--color-gold)" }}>
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="font-[var(--font-sans)] text-[9px] px-1"
                  style={{ color: "var(--color-ink-subtle)" }}>
                  * Precio referencial. El garzón confirma el total final.
                </p>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-[var(--font-sans)] text-[13px] font-bold"
                  style={{
                    background: "linear-gradient(135deg, #25D366, #128C7E)",
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar por WhatsApp
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </a>

                <m.button
                  whileTap={{ scale: 0.97 }}
                  onClick={resetCart}
                  className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-[var(--font-sans)] text-[11px] font-medium"
                  style={{
                    background: "rgba(201,168,76,0.06)",
                    color: "var(--color-ink-muted)",
                    border: "1px solid rgba(201,168,76,0.12)",
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Nueva experiencia
                </m.button>

                <p className="font-[var(--font-sans)] text-[8px] text-center tracking-[0.3em] uppercase mt-1"
                  style={{ color: "var(--color-ink-subtle)" }}>
                  Gracias por preferir Restobar Tinku
                </p>
              </div>
            )}
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
