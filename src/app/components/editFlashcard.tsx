"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import Loader from "@/app/components/loader";
import ImageUploadButton from "@/app/components/imageUploadButton";

import { db, storage } from "@/app/libs/firebase";
import { FirebaseUser } from "@/types/firebase";

export default function EditFlashcard() {
  const router = useRouter();
  const { id } = useParams();

  const [english, setEnglish] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [spanish, setSpanish] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const storedUser =
    typeof window !== "undefined"
      ? (JSON.parse(localStorage.getItem("lexloop_user") ?? "null") as FirebaseUser)
      : null;
  const userId = storedUser?.uid;

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
    setLoading(true);

    if (!english.trim()) {
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

    try {
      const ref = doc(db, "cards", id as string);
      await updateDoc(ref, {
        english: english.trim(),
        pronunciation: pronunciation.trim(),
        spanish: spanish.trim(),
        ...(imageUrl && { imageUrl }),
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
              showError
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
              }
            }}
            type="text"
            value={english}
          />
          {showError && <p className="mt-2 text-sm text-red-600">English word is required.</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="pronunciation">
            How to pronounce
          </label>
          <input
            autoComplete="off"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            id="pronunciation"
            maxLength={24}
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
            maxLength={48}
            onChange={(e) => setSpanish(e.target.value)}
            required
            type="text"
            value={spanish}
          />
        </div>

        <ImageUploadButton onFileSelect={(file) => setImageFile(file)} />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          className="w-full bg-blue-700 hover:bg-blue-800 text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none mt-4"
          type="submit"
        >
          Edit flashcard
        </button>
      </form>
    </div>
  );
}
