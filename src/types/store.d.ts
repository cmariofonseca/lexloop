import { Card } from "./ card";

export interface Store {
  cards: Card[];
  removeCard: (id: string) => void;
  setInitialCards: (initial: Card[]) => void;
}
