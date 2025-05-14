import { Card } from "./ card";

export interface Store {
  activeCardId: string | null;
  cards: Card[];
  removeCard: (id: string) => void;
  setActiveCardId: (id: string) => void;
  setInitialCards: (initial: Card[]) => void;
}
