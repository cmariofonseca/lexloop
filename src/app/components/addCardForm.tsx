"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";

import { db } from "@/app/libs/firebase";
import { useCardsStore } from "@/app/libs/useCardsStore";

import Loader from "@/app/components/loader";

import { FirebaseUser } from "@/types/firebase";
import { Card } from "@/types/ card";

export default function AddCardForm() {
  const [english, setEnglish] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [spanish, setSpanish] = useState("");
  const [loading, setLoading] = useState(false);
  const { cards, setInitialCards } = useCardsStore();

  const storedUser =
    typeof window !== "undefined"
      ? (JSON.parse(localStorage.getItem("lexloop_user") ?? "null") as FirebaseUser)
      : null;
  const userId = storedUser?.uid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!english.trim() || !pronunciation.trim() || !spanish.trim() || !userId) return;

    const newCard: Card = {
      createdAt: new Date(),
      english: english.trim(),
      id: "",
      pronunciation: pronunciation.trim(),
      spanish: spanish.trim(),
      userId,
    };

    try {
      await addDoc(collection(db, "cards"), newCard);
      setInitialCards([...cards, newCard]);
      setEnglish("");
      setPronunciation("");
      setSpanish("");
    } catch (err) {
      console.error("Error saving card to Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="english">
            English word
          </label>
          <input
            autoComplete="off"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            id="english"
            onChange={(e) => setEnglish(e.target.value)}
            required
            type="text"
            value={english}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="pronunciation">
            How to pronounce
          </label>
          <input
            autoComplete="off"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            id="pronunciation"
            onChange={(e) => setPronunciation(e.target.value)}
            required
            type="text"
            value={pronunciation}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="spanish">
            Spanish translation
          </label>
          <input
            autoComplete="off"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            id="spanish"
            onChange={(e) => setSpanish(e.target.value)}
            required
            type="text"
            value={spanish}
          />
        </div>

        <button
          className="w-full bg-blue-700 hover:bg-blue-800 text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none mt-4"
          type="submit"
        >
          Add flashcard
        </button>
      </form>
    </div>
  );
}
