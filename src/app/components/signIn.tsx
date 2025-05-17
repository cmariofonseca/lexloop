"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { auth } from "@/app/libs/firebase";
import { FirebaseUser } from "@/types/firebase";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isEmailValid = isValidEmail(email);
  const isPasswordValid = password.length >= 6;
  const isFormComplete = isEmailValid && isPasswordValid;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user: FirebaseUser = userCredential.user;

      localStorage.setItem("lexloop_user", JSON.stringify(user));
      router.push("/pages/cards");
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <form className="max-w-sm mx-auto" onSubmit={handleSignIn}>
        {/* Email */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="email">
            Your email
          </label>
          <input
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@mail.com"
            required
            type="email"
            value={email}
          />
          {!isEmailValid && email && (
            <p className="text-red-600 text-sm mt-1">Invalid email format</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="password">
            Your password
          </label>
          <input
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            id="password"
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (6+ characters)"
            required
            type="password"
            value={password}
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        {/* Submit Button */}
        <button
          className={`w-full mt-2 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center 
            ${isFormComplete ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-300 cursor-not-allowed"}`}
          disabled={!isFormComplete || loading}
          type="submit"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
