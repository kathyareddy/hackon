"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function MentorPage() {
  const [mode, setMode] = useState("coding"); // 'coding' or 'aptitude'
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskMentor = async () => {
    setLoading(true);
    setResponse("");

    const user = auth.currentUser;

    if (!user) {
      setResponse("❌ You're not logged in.");
      setLoading(false);
      return;
    }

    const prompt =
      mode === "coding"
        ? `Act like a senior programming mentor. Give clear explanations or feedback for: ${input}`
        : `Act like an aptitude trainer. Provide relevant help for: ${input}`;

    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          uid: user.uid,
          type: mode,
        }),
      });

      const data = await res.json();
      setResponse(data.result);
    } catch (err) {
      setResponse("❌ Error getting response from mentor.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎓 AI Interview Mentor
      </h1>

      <div className="flex gap-4 mb-4 justify-center">
        <button
          onClick={() => setMode("coding")}
          className={`px-4 py-2 rounded-lg transition-all font-semibold shadow ${
            mode === "coding"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
          }`}
        >
          🖥️ Coding
        </button>
        <button
          onClick={() => setMode("aptitude")}
          className={`px-4 py-2 rounded-lg transition-all font-semibold shadow ${
            mode === "aptitude"
              ? "bg-green-600 text-white"
              : "bg-white text-green-600 border border-green-600 hover:bg-green-50"
          }`}
        >
          📘 Aptitude
        </button>
      </div>

      <textarea
        className="w-full h-40 p-4 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={
          mode === "coding"
            ? "Paste your code or ask a coding question..."
            : "Ask about aptitude topics like probability, averages, etc..."
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleAskMentor}
        disabled={loading || !input.trim()}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask Mentor"}
      </button>

      {response && (
        <div className="mt-6 p-4 border rounded bg-gray-800 text-white whitespace-pre-wrap shadow">
          {response}
        </div>
      )}
    </div>
  );
}
