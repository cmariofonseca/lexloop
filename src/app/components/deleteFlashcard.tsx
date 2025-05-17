"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";

import { db } from "@/app/libs/firebase";
import { useCardsStore } from "@/app/libs/useCardsStore";

export default function DeleteFlashcard() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const confirmAndDelete = async () => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to delete this flashcard?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        backdrop: "#f1f5f9",
      });

      const { isConfirmed, isDenied, isDismissed } = result;

      if (isConfirmed) {
        try {
          await deleteDoc(doc(db, "cards", id));
          const store = useCardsStore.getState();
          store.removeCard(id);
          const remainingCards = store.cards;

          if (remainingCards.length > 0) {
            store.setActiveCardId(remainingCards[0].id ?? "");
          } else {
            store.setActiveCardId("");
          }

          await Swal.fire({
            title: "Deleted!",
            text: "Your flashcard has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            backdrop: "#f1f5f9",
          });

          setTimeout(() => router.push("/pages/cards"), 500);
        } catch (error) {
          await Swal.fire("Oops", "Failed to delete the flashcard", "error");
          await Swal.fire({
            title: "Oops!",
            text: "Failed to delete the flashcard",
            icon: "error",
            timer: 1500,
            showConfirmButton: false,
            backdrop: "#f1f5f9",
          });
          setTimeout(() => router.push("/pages/cards"), 500);
          throw error;
        }
      }

      if (isConfirmed === false && isDenied === false && isDismissed === true) {
        setTimeout(() => router.push("/pages/cards"), 500);
      }
    };

    confirmAndDelete();
  }, [id, router]);

  return null;
}
