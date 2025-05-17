"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { auth } from "@/app/libs/firebase";

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isEmailValid = isValidEmail(email);
  const isPasswordValid = password.length >= 6;
  const passwordsMatch = password === repeatPassword;
  const isFormComplete = isEmailValid && isPasswordValid && repeatPassword && passwordsMatch;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setRepeatPassword("");
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
      <form className="max-w-sm mx-auto" onSubmit={handleSignUp}>
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

        {/* Repeat Password */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="repeat-password">
            Repeat password
          </label>
          <input
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            id="repeat-password"
            minLength={6}
            onChange={(e) => setRepeatPassword(e.target.value)}
            placeholder="Repeat your password"
            required
            type="password"
            value={repeatPassword}
          />
        </div>

        {/* Validation messages */}
        {!passwordsMatch && repeatPassword && (
          <p className="text-red-600 text-sm mb-2">Passwords do not match</p>
        )}
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        {/* Submit Button */}
        <button
          className={`w-full mt-2 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center 
            ${
              isFormComplete ? "bg-green-700 hover:bg-green-800" : "bg-gray-300 cursor-not-allowed"
            }`}
          disabled={!isFormComplete || loading}
          type="submit"
        >
          {loading ? "Creating user..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
