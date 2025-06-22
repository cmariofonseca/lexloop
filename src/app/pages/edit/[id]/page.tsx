import { Metadata } from "next";

import EditFlashcard from "@/app/components/editFlashcard";

export const metadata: Metadata = {
  title: "Edit Flashcard",
  description:
    "Update your flashcards to correct, complete, or refine the vocabulary you’re learning.",
};

export default function EditPage() {
  return (
    <main className="w-full h-full flex justify-center items-center">
      <EditFlashcard />
    </main>
  );
}
