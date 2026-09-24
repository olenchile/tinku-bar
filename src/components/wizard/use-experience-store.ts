/**
 * Zustand Experience Store — Tinku Restobar
 * Estado complejo del canvas de experiencia no lineal.
 */

"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { computeAffinityMap, getTopRecommendations } from "@/lib/recommendation-engine";
import type {
  AffinityScore,
  ExperienceCartItem,
  ExperiencePanel,
  ExperienceState,
  MoodAttribute,
} from "@/types/wizard";

interface ExperienceActions {
  /* Moods */
  toggleMood:       (mood: MoodAttribute) => void;
  clearMoods:       () => void;

  /* Navegación */
  setPanel:         (panel: ExperiencePanel) => void;
  setActiveSection: (sectionId: string | null) => void;
  toggleSummary:    () => void;

  /* Carrito */
  addItem:          (item: Omit<ExperienceCartItem, "isRecommended"> & { isRecommended?: boolean }) => void;
  removeItem:       (id: string) => void;
  incrementItem:    (id: string) => void;
  decrementItem:    (id: string) => void;
  resetCart:        () => void;

  /* Engine */
  recalculate:      () => void;

  /* Computed */
  topRecs:          () => AffinityScore[];
  cartTotal:        () => number;
  cartCount:        () => number;
}

const INITIAL_STATE: ExperienceState = {
  selectedMoods:  [],
  activeSection:  null,
  cart:           [],
  affinityMap:    {},
  panel:          "canvas",
  summaryOpen:    false,
};

export const useExperienceStore = create<ExperienceState & ExperienceActions>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_STATE,

    /* ── Moods ── */
    toggleMood: (mood) => {
      set((s) => {
        const exists = s.selectedMoods.includes(mood);
        const selectedMoods = exists
          ? s.selectedMoods.filter((m) => m !== mood)
          : [...s.selectedMoods, mood].slice(-4); // máximo 4 atributos simultáneos
        return { selectedMoods };
      });
      get().recalculate();
    },

    clearMoods: () => {
      set({ selectedMoods: [] });
      get().recalculate();
    },

    /* ── Navegación ── */
    setPanel:         (panel)     => set({ panel }),
    setActiveSection: (activeSection) => set({ activeSection, panel: activeSection ? "explorer" : "canvas" }),
    toggleSummary:    ()          => set((s) => ({ summaryOpen: !s.summaryOpen })),

    /* ── Carrito ── */
    addItem: (item) => {
      set((s) => {
        const existing = s.cart.find((c) => c.id === item.id);
        const affinityScore = s.affinityMap[item.id]?.total;
        const cart = existing
          ? s.cart.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
          : [...s.cart, { ...item, qty: item.qty ?? 1, isRecommended: item.isRecommended ?? false, affinityScore }];
        return { cart };
      });
      get().recalculate();
    },

    removeItem: (id) => {
      set((s) => ({ cart: s.cart.filter((c) => c.id !== id) }));
      get().recalculate();
    },

    incrementItem: (id) => {
      set((s) => ({
        cart: s.cart.map((c) => c.id === id ? { ...c, qty: c.qty + 1 } : c),
      }));
    },

    decrementItem: (id) => {
      set((s) => ({
        cart: s.cart
          .map((c)   => c.id === id ? { ...c, qty: c.qty - 1 } : c)
          .filter((c) => c.qty > 0),
      }));
      get().recalculate();
    },

    resetCart: () => {
      set({ cart: [], affinityMap: {}, selectedMoods: [], panel: "canvas", summaryOpen: false, activeSection: null });
    },

    /* ── Engine ── */
    recalculate: () => {
      const { selectedMoods, cart } = get();
      const affinityMap = computeAffinityMap(selectedMoods, cart);
      set({ affinityMap });
    },

    /* ── Computed ── */
    topRecs: () => {
      const { affinityMap, cart } = get();
      return getTopRecommendations(affinityMap, cart, 6);
    },

    cartTotal: () =>
      get().cart.reduce((acc, item) => acc + (item.price ?? 0) * item.qty, 0),

    cartCount: () =>
      get().cart.reduce((acc, item) => acc + item.qty, 0),
  }))
);
