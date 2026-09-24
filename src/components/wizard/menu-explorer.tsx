"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Check, X } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator  from "@radix-ui/react-separator";
import { menuData, formatPrice, type MenuSectionId } from "@/data/menu";
import { CategoryIcon } from "@/components/category-icon";
import { useExperienceStore } from "@/components/wizard/use-experience-store";

interface MenuExplorerProps {
  sectionId: string;
  onClose:   () => void;
}

const listEnter = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};
const itemEnter = {
  hidden:  { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 30 } },
};

export function MenuExplorer({ sectionId, onClose }: MenuExplorerProps) {
  const { cart, addItem, removeItem, affinityMap } = useExperienceStore();
  const section = menuData[sectionId as MenuSectionId];
  if (!section) return null;

  return (
    <m.div
      key="explorer"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring" as const, stiffness: 320, damping: 32 }}
      className="absolute inset-0 flex flex-col"
      style={{ background: "var(--color-charcoal)" }}
    >
      {/* Header con degradado */}
      <div
        className="relative shrink-0 px-5 pt-5 pb-4"
        style={{
          background: `linear-gradient(160deg, ${section.accent}22 0%, transparent 60%)`,
          borderBottom: `1px solid ${section.accent}22`,
        }}
      >
        <div className="flex items-center gap-3">
          <m.button
            whileTap={{ scale: 0.88 }}
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(201,168,76,0.10)", border: "1px solid rgba(201,168,76,0.20)" }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: "var(--color-gold)" }} />
          </m.button>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <CategoryIcon emoji={section.emoji} size={34} alt={section.title} />
            <div className="min-w-0">
              <p className="font-[var(--font-display)] text-xl font-light italic text-[var(--color-cream)] truncate">
                {section.title}
              </p>
              <p className="font-[var(--font-sans)] text-[10px] tracking-widest uppercase"
                style={{ color: section.accent }}>
                {section.items.length} preparaciones
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista editorial */}
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full">
          <m.ul
            variants={listEnter}
            initial="hidden"
            animate="visible"
            className="px-5 py-3"
          >
            {section.items.map((item, idx) => {
              const itemId  = `${sectionId}-${item.name}`;
              const inCart  = cart.find((c) => c.id === itemId);
              const score   = affinityMap[itemId];
              const isLast  = idx === section.items.length - 1;
              const affinity = score?.total ?? null;

              return (
                <m.li key={item.name} variants={itemEnter}>
                  <div className="flex items-start gap-3 py-4">
                    {/* Afinidad % si existe */}
                    {affinity !== null ? (
                      <div className="shrink-0 flex flex-col items-center gap-0.5 mt-0.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            background: `conic-gradient(${section.accent} ${affinity * 3.6}deg, rgba(201,168,76,0.08) 0deg)`,
                          }}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: "var(--color-charcoal)" }}>
                            <span className="font-[var(--font-sans)] text-[7px] font-bold"
                              style={{ color: section.accent }}>
                              {affinity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-8 shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-[var(--font-serif)] text-[14px] font-medium italic text-[var(--color-cream)] leading-snug">
                        {item.name}
                      </p>
                      {/* Razón del engine */}
                      {score?.why && affinity && affinity >= 70 && (
                        <p className="font-[var(--font-sans)] text-[10px] italic mt-0.5"
                          style={{ color: `${section.accent}cc` }}>
                          {score.why}
                        </p>
                      )}
                      {item.description && (
                        <p className="font-[var(--font-sans)] text-[10px] text-[var(--color-ink-subtle)] mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      <p className="font-[var(--font-display)] text-[16px] font-light tabular-nums mt-1.5"
                        style={{ color: section.accent }}>
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Add/Remove */}
                    <m.button
                      whileTap={{ scale: 0.82 }}
                      onClick={() => {
                        if (inCart) {
                          removeItem(itemId);
                        } else {
                          addItem({
                            id: itemId, sectionId: section.id,
                            name: item.name, price: item.price,
                            qty: 1, group: section.group, isRecommended: false,
                          });
                        }
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all"
                      style={inCart
                        ? { backgroundColor: section.accent, color: "#0e0c0a" }
                        : { backgroundColor: `${section.accent}15`, color: section.accent, border: `1px solid ${section.accent}33` }
                      }
                    >
                      {inCart
                        ? <span className="font-[var(--font-sans)] text-[12px] font-bold">{inCart.qty}</span>
                        : <Plus className="w-4 h-4" strokeWidth={2.5} />
                      }
                    </m.button>
                  </div>

                  {!isLast && (
                    <Separator.Root decorative className="h-px"
                      style={{ backgroundColor: "rgba(201,168,76,0.08)" }} />
                  )}
                </m.li>
              );
            })}
          </m.ul>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical"
          className="flex select-none touch-none p-0.5 w-1.5">
          <ScrollArea.Thumb className="flex-1 rounded-full"
            style={{ backgroundColor: "rgba(201,168,76,0.25)" }} />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </m.div>
  );
}
