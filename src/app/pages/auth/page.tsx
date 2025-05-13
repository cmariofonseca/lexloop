"use client";
import { useState } from "react";

import SignInForm from "../../components/signInForm";
import SignUpForm from "../../components/signUpForm";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {isSignIn ? <SignInForm /> : <SignUpForm />}
      <button className="mt-4 text-blue-600 cursor-pointer" onClick={() => setIsSignIn(!isSignIn)}>
        {isSignIn ? "Don't have an account? Create one" : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
