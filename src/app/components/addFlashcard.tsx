"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

import { db, storage } from "@/app/libs/firebase";
import { useCardsStore } from "@/app/libs/useCardsStore";

import ImageUploadButton from "@/app/components/imageUploadButton";
import Loader from "@/app/components/loader";

import { FirebaseUser } from "@/types/firebase";
import { Card } from "@/types/ card";

export default function AddFlashcard() {
  const [english, setEnglish] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [spanish, setSpanish] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { cards, setInitialCards } = useCardsStore();
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const storedUser =
    typeof window !== "undefined"
      ? (JSON.parse(localStorage.getItem("lexloop_user") ?? "null") as FirebaseUser)
      : null;
  const userId = storedUser?.uid;

  const checkDuplicateEnglishWord = (word: string) => {
    const exists = cards.some(
      (card) => card.english.toLowerCase().trim() === word.toLowerCase().trim()
    );
    setIsDuplicate(exists);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!english.trim() || !userId) {
      setShowError(true);
      setLoading(false);
      return;
    }

    setShowError(false);

    let imageUrl = null;

    const sanitizedName = english
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (imageFile) {
      const imageRef = ref(storage, `flashcards/${userId}/${Date.now()}-${sanitizedName}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const newCard: Card = {
      createdAt: new Date(),
      english: english.trim(),
      pronunciation: pronunciation.trim(),
      spanish: spanish.trim(),
      userId,
      ...(imageUrl && { imageUrl }),
    };

    try {
      await addDoc(collection(db, "cards"), newCard);
      setInitialCards([...cards, newCard]);
      setEnglish("");
      setPronunciation("");
      setSpanish("");
      setImageFile(null);
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
          <label
            className={`block mb-2 text-sm font-medium ${
              showError ? "text-red-700" : "text-gray-900"
            }`}
            htmlFor="english"
          >
            <span className="text-red-500">*</span> English word
          </label>
          <input
            autoComplete="off"
            className={`block w-full p-2.5 text-sm rounded-lg shadow-xs ${
              showError || isDuplicate
                ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500"
                : "bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            }`}
            id="english"
            maxLength={24}
            onChange={(e) => {
              const value = e.target.value;
              setEnglish(value);
              if (value.trim().length > 0) {
                setShowError(false);
                setIsDuplicate(false); // Reiniciar estado de duplicado si el usuario empieza a escribir
              }
            }}
            onBlur={() => {
              if (english.trim().length > 0) {
                checkDuplicateEnglishWord(english);
              }
            }}
            type="text"
            value={english}
          />
          {showError && <p className="mt-2 text-sm text-red-600">English word is required.</p>}
          {isDuplicate && (
            <p className="mt-2 text-sm text-red-600">
              This English word already exists in your cards.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="pronunciation">
            How to pronounce <small className="text-gray-400">(optional)</small>
          </label>
          <input
            autoComplete="off"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            id="pronunciation"
            maxLength={24}
            onChange={(e) => setPronunciation(e.target.value)}
            type="text"
            value={pronunciation}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="spanish">
            Translation or definition in English <small className="text-gray-400">(optional)</small>
          </label>
          <input
            autoComplete="off"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            id="spanish"
            maxLength={48}
            onChange={(e) => setSpanish(e.target.value)}
            type="text"
            value={spanish}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 font-medium text-gray-900" htmlFor="spanish">
            Related image <small className="text-gray-400">(optional)</small>
          </label>
          <ImageUploadButton onFileSelect={(file) => setImageFile(file)} />
        </div>

        <button
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
          type="submit"
        >
          Add flashcard
        </button>
      </form>
    </div>
  );
}
