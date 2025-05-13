"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";

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

  useEffect(() => {
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

    fetchCards();

    // Refetch cards when user returns to this page
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchCards();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [router, setInitialCards]);

  const handleSwipe = (offsetY: number) => {
    if (Math.abs(offsetY) > 100) {
      setIndex((prev) => (prev + 1) % cards.length);
    }
  };

  if (loading) return <Loader />;

  if (cards.length === 0) {
    return <p className="text-center mt-20 text-gray-600">Loading cards...</p>;
  }

  return (
    <div className="w-full h-full overflow-hidden flex justify-center items-center">
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
    </div>
  );
}
