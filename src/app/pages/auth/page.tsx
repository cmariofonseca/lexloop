'use client';
import { useState } from 'react';

import SignInForm from '../../components/signInForm';
import SignUpForm from '../../components/signUpForm';

export default function AuthPage() {
    const [isSignIn, setIsSignIn] = useState(true);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
            {isSignIn ? <SignInForm /> : <SignUpForm />}
            <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="mt-4 text-blue-600 cursor-pointer"
            >
                {isSignIn
                    ? "Don't have an account? Create one"
                    : "Already have an account? Sign in"}
            </button>
        </main>
    );
}
