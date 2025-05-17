"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, PlusSquare, SquareChartGantt, Trash2 } from "lucide-react";

import { useCardsStore } from "../libs/useCardsStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeCardId = useCardsStore((state) => state.activeCardId);

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
      {/* Logo/Version */}
      <Link href="">
        <small className="text-slate-400">v:1.13.0</small>
      </Link>

      {/* View Cards */}
      <Link
        className={
          pathname === "/pages/cards" ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        }
        href="/pages/cards"
      >
        <SquareChartGantt size={24} />
      </Link>

      {/* Add Card */}
      <Link
        className={
          pathname === "/pages/add" ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        }
        href="/pages/add"
      >
        <PlusSquare size={24} />
      </Link>

      {/* Delete Card */}
      <button
        className="text-gray-600 hover:text-red-500"
        onClick={handleDelete}
        aria-label="Delete active card"
      >
        <Trash2 size={24} />
      </button>

      {/* Edit Card */}
      <button
        className={
          pathname.startsWith("/pages/edit") ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        }
        onClick={handleEdit}
        aria-label="Edit active card"
      >
        <Pencil size={24} />
      </button>
    </nav>
  );
}
