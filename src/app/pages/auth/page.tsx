"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/app/libs/firebase";
import { useCardsStore } from "@/app/libs/useCardsStore";

import SignIn from "@/app/components/signIn";
import SignUp from "@/app/components/signUp";
import Loader from "@/app/components/loader";

export default function AuthPage() {
  const [loading, setLoading] = useState(true);
  const [isSignIn, setIsSignIn] = useState(true);

  const router = useRouter();
  const { cards } = useCardsStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const hasCards = cards && cards.length > 0;

      if (user && hasCards) {
        router.replace("/pages/cards");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [cards, router]);

  if (loading) return <Loader />;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {isSignIn ? <SignIn /> : <SignUp />}
      <button className="mt-4 text-blue-600 cursor-pointer" onClick={() => setIsSignIn(!isSignIn)}>
        {isSignIn ? "Don't have an account? Create one" : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
