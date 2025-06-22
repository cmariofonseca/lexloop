import { Metadata } from "next";

import EditFlashcard from "@/app/components/editFlashcard";

export const metadata: Metadata = {
  title: "Edit Flashcard",
  description:
    "Update your flashcards to correct, complete, or refine the vocabulary you’re learning.",
};

export default function EditPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <EditFlashcard />
    </main>
  );
}
