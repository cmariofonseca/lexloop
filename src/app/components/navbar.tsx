"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, PlusSquare, SquareChartGantt, Trash2 } from "lucide-react";

import { useCardsStore } from "../libs/useCardsStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isEditPage = pathname.startsWith("/pages/edit");
  const isDeletePage = pathname.startsWith("/pages/delete");
  const isAddPage = pathname === "/pages/add";

  const activeCardId = useCardsStore((state) => state.activeCardId);
  const cards = useCardsStore((state) => state.cards);
  const noCards = cards.length === 0;
  const isViewDisabled = noCards;
  const isDeleteDisabled = noCards || isEditPage || isAddPage;
  const isEditDisabled = noCards || isDeletePage || isAddPage;

  const handleEdit = () => {
    if (!activeCardId) return alert("No card selected");
    router.push(`/pages/edit/${activeCardId}`);
  };

  const handleDelete = () => {
    if (!activeCardId) return alert("No card selected");
    router.push(`/pages/delete/${activeCardId}`);
  };

  return (
    <nav className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm z-10 flex justify-around items-center">
      {/* Version */}
      <Link href="">
        <small className="text-slate-400">v:1.13.0</small>
      </Link>

      {/* View Cards */}
      <button
        disabled={isViewDisabled}
        className={`${
          pathname === "/pages/cards" ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        } ${isViewDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => router.push("/pages/cards")}
        aria-label="View cards"
      >
        <SquareChartGantt size={24} />
      </button>

      {/* Add Card */}
      <Link
        className={`${
          pathname === "/pages/add" ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        }`}
        href="/pages/add"
      >
        <PlusSquare size={24} />
      </Link>

      {/* Delete Card */}
      <button
        disabled={isDeleteDisabled}
        className={`text-gray-600 hover:text-red-500 ${
          isDeleteDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleDelete}
        aria-label="Delete active card"
      >
        <Trash2 size={24} />
      </button>

      {/* Edit Card */}
      <button
        disabled={isEditDisabled}
        className={`${
          pathname.startsWith("/pages/edit") ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        } ${isEditDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleEdit}
        aria-label="Edit active card"
      >
        <Pencil size={24} />
      </button>
    </nav>
  );
}
