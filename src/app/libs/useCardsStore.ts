"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Card = {
  id: string;
  english: string;
  spanish: string;
};

type Store = {
  cards: Card[];
  removeCard: (id: string) => void;
  setInitialCards: (initial: Card[]) => void;
};

export const useCardsStore = create<Store>()(
  persist(
    (set, get) => ({
      cards: [],
      setInitialCards: (initial) => {
        if (get().cards.length === 0) {
          set({ cards: initial });
        }
      },
      removeCard: (id) => set({ cards: get().cards.filter((card) => card.id !== id) }),
    }),
    {
      name: "lexloop-cards", // clave en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
