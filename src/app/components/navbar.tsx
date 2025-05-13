"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusSquare, Square } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white border-b shadow-sm z-10 flex justify-around items-center h-full">
      <Link
        href="/pages/cards"
        className={pathname === "/pages/cards" ? "text-blue-600" : "text-gray-400"}
      >
        <Square size={24} />
      </Link>

      <Link
        href="/pages/add"
        className={pathname === "/pages/add" ? "text-blue-600" : "text-gray-400"}
      >
        <PlusSquare size={24} />
      </Link>

      <Link
        href="/pages/cards"
        className={pathname === "/pages/cards" ? "text-blue-600" : "text-gray-400"}
      >
        <small>v:1.10.1</small>
      </Link>
    </nav>
  );
}
