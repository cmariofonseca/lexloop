import { Metadata } from "next";

import DeleteFlashcard from "@/app/components/deleteFlashcard";

export const metadata: Metadata = {
  title: "Delete Flashcards",
  description:
    "Manage your flashcards by deleting those you no longer need. Keep your learning list clean and up to date.",
};

export default function DeletePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <DeleteFlashcard />
    </main>
  );
}
