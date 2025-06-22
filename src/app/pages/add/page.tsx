import { Metadata } from "next";

import AddFlashcard from "@/app/components/addFlashcard";

export const metadata: Metadata = {
  title: "Add Flashcard",
  description:
    "Create new English vocabulary flashcards by entering a word, its meaning or image, and pronunciation to expand your learning library.",
};

export default function AddPage() {
  return (
    <main className="w-full h-full flex justify-center items-center">
      <AddFlashcard />
    </main>
  );
}
