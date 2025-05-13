"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, Pencil } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";

import { db } from "@/app/libs/firebase";
import { useCardsStore } from "@/app/libs/useCardsStore";

import Loader from "@/app/components/loader";
import { useState } from "react";

type Props = {
  readonly id: string;
  readonly english: string;
  readonly pronunciation: string;
  readonly spanish: string;
};

export default function Flashcard({ id, english, pronunciation, spanish }: Props) {
  const router = useRouter();

  const removeCard = useCardsStore((state) => state.removeCard);

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteDoc(doc(db, "cards", id));
      removeCard(id); // elimina del store local
    } catch (err) {
      console.error("Error deleting card:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    router.push(`/pages/edit/${id}`);
  };

  if (loading) return <Loader />;

  return (
    <motion.div
      className="relative bg-white max-w-sm w-[90%] h-[93%] p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center"
      whileTap={{ scale: 0.98 }}
    >
      {/* Delete Button - top left */}
      <button
        aria-label="Delete card"
        className="absolute top-4 left-4 text-gray-400 hover:text-red-500 z-10"
        onClick={handleDelete}
      >
        <Trash2 size={20} />
      </button>

      {/* Update Button - top right */}
      <button
        aria-label="Update card"
        className="absolute top-4 right-4 text-gray-400 hover:text-blue-500 z-10"
        onClick={handleUpdate}
      >
        <Pencil size={20} />
      </button>

      {/* Content */}
      <h2 className="text-4xl font-bold text-blue-700">{english}</h2>
      <p className=" text-gray-400 mt-2">({pronunciation})</p>
      <p className="text-xl text-gray-600 mt-6">{spanish}</p>
    </motion.div>
  );
}
