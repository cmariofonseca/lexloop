import { Metadata } from "next";

import MemoryGame from "@/app/components/memoryGame";

export const metadata: Metadata = {
  title: "Memory Game",
  description:
    "Train your memory by matching English words with their images or translations. A fun way to reinforce vocabulary learning.",
};

export default function PlayPage() {
  return (
    <main className="w-full h-full flex justify-center items-center">
      <MemoryGame />
    </main>
  );
}
