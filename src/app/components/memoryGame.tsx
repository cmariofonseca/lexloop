"use client";

import { useEffect, useState } from "react";
import { useCardsStore } from "@/app/libs/useCardsStore";
import Image from "next/image";

type GameCard = {
  id: string;
  content: string | { src: string };
  type: "text" | "image";
  matched: boolean;
  flipped: boolean;
  pairId: string;
};

export default function MemoryGame() {
  const { cards } = useCardsStore();
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [firstCard, setFirstCard] = useState<GameCard | null>(null);
  const [secondCard, setSecondCard] = useState<GameCard | null>(null);
  const [lock, setLock] = useState(false);

  // Crea las 20 tarjetas a partir de las 10 flashcards
  useEffect(() => {
    const preparedCards: GameCard[] = cards.slice(0, 10).flatMap((card) => {
      const pairId = card.id;

      const cardA: GameCard = {
        id: `${pairId}-A`,
        content: card.english,
        type: "text",
        matched: false,
        flipped: false,
        pairId: pairId ?? "",
      };

      const cardB: GameCard = {
        id: `${pairId}-B`,
        content: card.imageUrl ?? card.spanish,
        type: card.imageUrl ? "image" : "text",
        matched: false,
        flipped: false,
        pairId: pairId ?? "",
      };

      return [cardA, cardB];
    });

    const shuffled = [...preparedCards].sort(() => Math.random() - 0.5);
    setGameCards(shuffled);
  }, [cards]);

  // Helper functions to reduce nesting
  const handleMatch = (pairId: string) => {
    setGameCards((prev) => prev.map((c) => (c.pairId === pairId ? { ...c, matched: true } : c)));
  };

  const handleNoMatch = (firstCardId: string, secondCardId: string) => {
    setGameCards((prev) =>
      prev.map((c) =>
        c.id === firstCardId || c.id === secondCardId ? { ...c, flipped: false } : c
      )
    );
  };

  // Manejo de selección de tarjetas
  const handleCardClick = (card: GameCard) => {
    if (lock || card.flipped || card.matched) return;

    const updatedCards = gameCards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c));
    setGameCards(updatedCards);

    if (!firstCard) {
      setFirstCard(card);
      return;
    }
    if (!secondCard) {
      setSecondCard(card);
      setLock(true);

      setTimeout(() => {
        if (firstCard.pairId === card.pairId) {
          // Match
          handleMatch(card.pairId);
        } else {
          // No match
          handleNoMatch(firstCard.id, card.id);
        }
        setFirstCard(null);
        setSecondCard(null);
        setLock(false);
      }, 800);
    }
  };

  // Helper to render card content
  const renderCardContent = (card: GameCard) => {
    if (card.type === "text" && typeof card.content === "string") {
      return <span className="text-sm font-medium text-gray-700">{card.content}</span>;
    } else if (card.type === "image" && typeof card.content === "string") {
      return (
        <Image src={card.content} alt="card image" width={80} height={80} className="rounded" />
      );
    } else if (card.type === "image" && typeof card.content === "object" && "src" in card.content) {
      return (
        <Image src={card.content.src} alt="card image" width={80} height={80} className="rounded" />
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4 max-w-4xl">
      {gameCards.map((card) => (
        <button
          key={card.id}
          onClick={() => handleCardClick(card)}
          className={`w-18 h-24 rounded-lg border flex items-center justify-center text-center cursor-pointer select-none transition-all duration-300 ${
            card.flipped || card.matched ? "bg-white" : "bg-blue-200 hover:bg-blue-300"
          } ${card.matched ? "opacity-50 pointer-events-none" : ""}`}
        >
          {(card.flipped || card.matched) && renderCardContent(card)}
        </button>
      ))}
    </div>
  );
}
