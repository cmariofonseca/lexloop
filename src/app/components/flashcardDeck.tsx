"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ChevronDown, ChevronUp } from "lucide-react";

import { db } from "@/app/libs/firebase";
import { useCardsStore } from "@/app/libs/useCardsStore";

import Flashcard from "@/app/components/flashcard";
import Loader from "@/app/components/loader";

import { FirebaseUser } from "@/types/firebase";
import { Card } from "@/types/ card";

export default function FlashcardDeck() {
  const { cards, setInitialCards } = useCardsStore();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchCards = async () => {
    setLoading(true);

    const storedUser =
      typeof window !== "undefined"
        ? (JSON.parse(localStorage.getItem("lexloop_user") ?? "null") as FirebaseUser)
        : null;

    if (!storedUser?.uid) {
      router.push("/pages/auth");
      return;
    }

    const q = query(collection(db, "cards"), where("userId", "==", storedUser.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      router.push("/pages/add");
      return;
    }

    const userCards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Card[];

    setInitialCards(userCards);
    setLoading(false);
  };

  useEffect(() => {
    const sessionFlag = sessionStorage.getItem("session_started");

    if (!sessionFlag) {
      fetchCards().then(() => {
        sessionStorage.setItem("session_started", "true");
      });
    }

    if (sessionFlag && cards.length === 0) {
      setLoading(true);
      setTimeout(() => setLoading(false), 300);
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && cards.length === 0) {
        fetchCards();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [router, setInitialCards, cards.length]);

  useEffect(() => {
    if (cards.length > 0) {
      useCardsStore.getState().setActiveCardId(cards[index].id ?? "");
    }
  }, [cards, index]);

  const handleSwipe = (offsetY: number) => {
    if (Math.abs(offsetY) > 100) {
      if (offsetY < 0) {
        setIndex((prev) => (prev + 1) % cards.length);
      } else {
        setIndex((prev) => (prev - 1 + cards.length) % cards.length);
      }
    }
  };

  if (loading) return <Loader />;
  if (cards.length === 0) {
    return <p className="text-center mt-20 text-gray-600">Loading cards...</p>;
  }

  return (
    <div className="w-full h-full flex justify-center items-center relative">
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-full flex justify-center items-center"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.5}
          exit={{ opacity: 0, y: -50 }}
          initial={{ opacity: 0, y: 50 }}
          key={cards[index].id}
          onDragEnd={(_, info) => handleSwipe(info.offset.y)}
          transition={{ duration: 0.3 }}
        >
          <Flashcard {...cards[index]} />
        </motion.div>
      </AnimatePresence>

      {/* Botones visibles en pantallas medianas o grandes */}
      <div className="hidden md:flex absolute right-6 top-1/2 transform -translate-y-1/2 flex-col space-y-4 z-10">
        <button
          onClick={() => handleSwipe(-150)}
          className="rounded-full shadow border-2 border-blue-700 hover:bg-white transition p-3"
          aria-label="Previous card"
        >
          <ChevronUp size={24} />
        </button>
        <button
          onClick={() => handleSwipe(150)}
          className="rounded-full shadow border-2 border-blue-700 hover:bg-white transition p-3"
          aria-label="Next card"
        >
          <ChevronDown size={24} color="#1a56db" />
        </button>
      </div>
    </div>
  );
}
