"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Store } from "@/types/store";

export const useCardsStore = create<Store>()(
  persist(
    (set, get) => ({
      cards: [],
      setInitialCards: (initial) => {
        set({ cards: initial });
      },
      removeCard: (id) => set({ cards: get().cards.filter((card) => card.id !== id) }),
    }),
    {
      name: "lexloop-cards", // clave en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
