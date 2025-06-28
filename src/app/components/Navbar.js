"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-blue-900 text-white shadow-md">
      <Link href="/" className="text-xl font-semibold">
        🎯 Interview Mentor
      </Link>

      <div className="flex gap-4 items-center text-sm sm:text-base">
        <Link href="/" className="hover:underline">
          🏠 Home
        </Link>
        <Link href="/dashboard" className="hover:underline">
          📊 Dashboard
        </Link>
        <Link href="/mentor" className="hover:underline">
          🤖 AI Mentor
        </Link>
        <Link href="/aptitude" className="hover:underline">
          🧠 Aptitude
        </Link>

        {user ? (
          <>
            <span className="text-sm">Hi, {user.email}</span>
            <button
              onClick={() => signOut(auth)}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-white text-blue-900 px-3 py-1 rounded hover:bg-gray-200"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
