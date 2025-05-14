"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Store } from "@/types/store";

export const useCardsStore = create<Store>()(
  persist(
    (set) => ({
      activeCardId: null,
      cards: [],
      removeCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
          activeCardId: null,
        })),
      setActiveCardId: (id) => set({ activeCardId: id }),
      setInitialCards: (initial) => {
        set({ cards: initial });
        if (initial.length > 0) {
          set({ activeCardId: initial[0].id }); // establecer el primero como activo por defecto
        }
      },
    }),
    {
      name: "lexloop-cards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
