"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Pencil, PlusSquare, SquareChartGantt, Trash2 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";

import { db } from "@/app/libs/firebase";
import { useCardsStore } from "../libs/useCardsStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeCardId = useCardsStore((state) => state.activeCardId);

  const handleDelete = async () => {
    if (!activeCardId) return alert("No card selected");

    const confirmDelete = confirm("Are you sure you want to delete this card?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "cards", activeCardId));
      const store = useCardsStore.getState();
      store.removeCard(activeCardId);
      const remainingCards = store.cards;

      if (remainingCards.length > 0) {
        store.setActiveCardId(remainingCards[0].id ?? "");
      } else {
        store.setActiveCardId("");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = () => {
    if (!activeCardId) return alert("No card selected");
    router.push(`/pages/edit/${activeCardId}`);
  };

  return (
    <nav className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm z-10 flex justify-around items-center">
      {/* Logo/Version */}
      <Link
        className={pathname === "/pages/cards" ? "text-blue-600" : "text-gray-400"}
        href="/pages/cards"
      >
        <small className="text-slate-300">v:1.12.1</small>
      </Link>

      {/* View Cards */}
      <Link
        className={pathname === "/pages/cards" ? "text-blue-600" : "text-gray-400"}
        href="/pages/cards"
      >
        <SquareChartGantt size={24} />
      </Link>

      {/* Add Card */}
      <Link
        className={pathname === "/pages/add" ? "text-blue-600" : "text-gray-400"}
        href="/pages/add"
      >
        <PlusSquare size={24} />
      </Link>

      {/* Delete Card */}
      <button
        className="text-gray-400 hover:text-red-500"
        onClick={handleDelete}
        aria-label="Delete active card"
      >
        <Trash2 size={24} />
      </button>

      {/* Edit Card */}
      <button
        className="text-gray-400 hover:text-blue-500"
        onClick={handleEdit}
        aria-label="Edit active card"
      >
        <Pencil size={24} />
      </button>
    </nav>
  );
}
