'use client';
import Link from 'next/link';
import { LogIn, PlusSquare, Square } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="w-full bg-white border-b shadow-sm z-10 flex justify-around items-center h-full">
            <Link href="/cards" className={pathname === '/cards' ? 'text-blue-600' : 'text-gray-400'}>
                <Square size={24} />
            </Link>
            <Link href="/add" className={pathname === '/add' ? 'text-blue-600' : 'text-gray-400'}>
                <PlusSquare size={24} />
            </Link>
            <Link href="/auth" className={pathname === '/auth' ? 'text-blue-600' : 'text-gray-400'}>
                <LogIn size={24} />
            </Link>
        </nav>
    );
}
