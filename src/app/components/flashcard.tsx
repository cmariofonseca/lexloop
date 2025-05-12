"use client";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

import { useCardsStore } from "@/app/libs/useCardsStore";

type Props = {
  readonly id: string;
  readonly english: string;
  readonly spanish: string;
};

export default function Flashcard({ id, english, spanish }: Props) {
  const removeCard = useCardsStore((state) => state.removeCard);

  return (
    <motion.div
      className="relative bg-white max-w-sm w-[90%] h-[93%] p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center"
      whileTap={{ scale: 0.98 }}
    >
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10"
        onClick={() => removeCard(id)}
      >
        <Trash2 size={20} />
      </button>

      <h2 className="text-4xl font-bold text-blue-700">{english}</h2>
      <p className="text-xl text-gray-600 mt-4">{spanish}</p>
    </motion.div>
  );
}
