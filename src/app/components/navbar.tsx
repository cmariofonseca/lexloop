"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusSquare, Square } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm z-10 flex justify-around items-center">
      <Link
        className={pathname === "/pages/cards" ? "text-blue-600" : "text-gray-400"}
        href="/pages/cards"
      >
        <Square size={24} />
      </Link>

      <Link
        className={pathname === "/pages/add" ? "text-blue-600" : "text-gray-400"}
        href="/pages/add"
      >
        <PlusSquare size={24} />
      </Link>

      <Link
        className={pathname === "/pages/cards" ? "text-blue-600" : "text-gray-400"}
        href="/pages/cards"
      >
        <small className="text-slate-300">v:1.12.1</small>
      </Link>
    </nav>
  );
}
