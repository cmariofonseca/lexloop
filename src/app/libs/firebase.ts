import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBITFo0FJ9AV_8o4drMNxoQyz1N8Omx1s",
  authDomain: "lexloop-72606.firebaseapp.com",
  projectId: "lexloop-72606",
  storageBucket: "lexloop-72606.firebasestorage.app",
  messagingSenderId: "790556973310",
  appId: "1:790556973310:web:f7f3a2819aed6f6125adaf",
  measurementId: "G-200HS022JR",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
