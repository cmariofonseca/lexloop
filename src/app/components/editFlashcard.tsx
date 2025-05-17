"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "@/app/libs/firebase";

import Loader from "@/app/components/loader";

export default function EditFlashcard() {
  const router = useRouter();
  const { id } = useParams();

  const [english, setEnglish] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [spanish, setSpanish] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    const fetchCard = async () => {
      if (!id || typeof id !== "string") return;

      try {
        const ref = doc(db, "cards", id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          setError("Card not found");
          return;
        }

        const data = snapshot.data();
        setEnglish(data.english ?? "");
        setPronunciation(data.pronunciation ?? "");
        setSpanish(data.spanish ?? "");
      } catch (err) {
        console.error("Error loading card:", err);
        setError("Error loading card.");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!english.trim() || !pronunciation.trim() || !spanish.trim()) return;

    try {
      const ref = doc(db, "cards", id as string);
      await updateDoc(ref, {
        english: english.trim(),
        pronunciation: pronunciation.trim(),
        spanish: spanish.trim(),
      });

      router.push("/pages/cards");
    } catch (err) {
      console.error("Error updating card:", err);
      setError("Could not update card.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <form className="max-w-sm mx-auto" onSubmit={handleUpdate}>
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
          <label className="block text-sm mb-1 font-medium text-gray-900" htmlFor="spanish">
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

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          className="w-full bg-blue-700 hover:bg-blue-800 text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
          type="submit"
        >
          Edit flashcard
        </button>
      </form>
    </div>
  );
}
