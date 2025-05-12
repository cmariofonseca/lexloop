"use client";
import { useCardsStore } from "@/app/lib/useCardsStore";
import Flashcard from "./flashcard";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function FlashcardDeck() {
  const { cards, setInitialCards } = useCardsStore();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setInitialCards([
      { id: "1", english: "Apple", spanish: "Manzana" },
      { id: "2", english: "Chair", spanish: "Silla" },
      { id: "3", english: "Window", spanish: "Ventana" },
    ]);
  }, [setInitialCards]);

  const handleSwipe = (offsetY: number) => {
    if (Math.abs(offsetY) > 100) {
      setIndex((prev) => (prev + 1) % cards.length);
    }
  };

  if (cards.length === 0) {
    return <p className="text-center mt-20">No hay tarjetas</p>;
  }

  return (
    <div className="w-full h-full overflow-hidden flex justify-center items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={cards[index].id}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.5}
          onDragEnd={(_, info) => handleSwipe(info.offset.y)}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex justify-center items-center"
        >
          <Flashcard {...cards[index]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
