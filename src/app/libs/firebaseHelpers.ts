import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/libs/firebase";

export const deleteCardFromFirestore = async (id: string) => {
  try {
    await deleteDoc(doc(db, "cards", id));
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
};
