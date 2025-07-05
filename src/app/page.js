"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center bg-[#fdf8f2]">
      <h1 className="text-4xl font-bold mb-2 text-blue-700">
        🎯 AI-Powered Interview Mentor
      </h1>
      <p className="text-lg text-gray-700 max-w-xl">
        Your personalized learning platform for coding and aptitude training.
        Learn, practice, and track your growth — all in one place.
      </p>
    </div>
  );
}
