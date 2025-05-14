"use client";

import { motion } from "framer-motion";

type Props = {
  readonly english: string;
  readonly pronunciation: string;
  readonly spanish: string;
};

export default function Flashcard({ english, pronunciation, spanish }: Props) {
  return (
    <motion.div
      className="relative bg-white max-w-sm w-[90%] h-[93%] p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center"
      whileTap={{ scale: 0.98 }}
    >
      <h2 className="text-4xl font-bold text-blue-700 text-center break-words">{english}</h2>
      <p className="text-gray-400 mt-2 text-center break-words">({pronunciation})</p>
      <p className="text-xl text-gray-600 mt-6 text-center break-words">{spanish}</p>
    </motion.div>
  );
}
