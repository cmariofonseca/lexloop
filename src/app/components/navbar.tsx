"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, PlusSquare, SquareChartGantt, Trash2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/app/libs/firebase";
import { useCardsStore } from "../libs/useCardsStore";

export default function Navbar() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const activeCardId = useCardsStore((state) => state.activeCardId);
  const cards = useCardsStore((state) => state.cards);

  const isEditPage = pathname.startsWith("/pages/edit");
  const isDeletePage = pathname.startsWith("/pages/delete");
  const isAddPage = pathname === "/pages/add";
  const isAuthPage = pathname === "/pages/auth";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const noCards = cards.length === 0;
  const isViewDisabled = isAuthPage || noCards || !userLoggedIn;
  const isDeleteDisabled = isAuthPage || noCards || isEditPage || isAddPage || !userLoggedIn;
  const isEditDisabled = isAuthPage || noCards || isDeletePage || isAddPage || !userLoggedIn;
  const isAddDisabled = isAuthPage || !userLoggedIn;

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
        <small className="text-slate-400">v:1.15.0</small>
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
      <button
        disabled={isAddDisabled}
        className={`${
          pathname === "/pages/add" ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        } ${isAddDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => router.push("/pages/add")}
        aria-label="Add card"
      >
        <PlusSquare size={24} />
      </button>

      {/* Delete Card */}
      <button
        disabled={isDeleteDisabled}
        className={`text-gray-600 hover:text-red-500 ${
          isDeleteDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleDelete}
        aria-label="Delete card"
      >
        <Trash2 size={24} />
      </button>

      {/* Edit Card */}
      <button
        disabled={isEditDisabled}
        className={`${isEditPage ? "text-blue-600" : "text-gray-600 hover:text-blue-500"} ${
          isEditDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleEdit}
        aria-label="Edit card"
      >
        <Pencil size={24} />
      </button>
    </nav>
  );
}
