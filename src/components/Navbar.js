"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold text-blue-600">🎓 Interview Mentor</h1>

      <div className="flex gap-6 text-sm sm:text-base">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/mentor" className="hover:underline">
          Mentor
        </Link>
        <Link href="/aptitude" className="hover:underline">
          Aptitude
        </Link>
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <button onClick={handleLogout} className="text-red-500 hover:underline">
          Logout
        </button>
      </div>
    </nav>
  );
}
