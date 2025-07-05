"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { generateCodingQuestions } from "@/lib/genCodingQuestions";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CodingPage() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadQuestions = async () => {
    if (!topic) return;
    setLoading(true);
    const qns = await generateCodingQuestions(topic);
    setQuestions(qns);
    setCurrent(0);
    setSelected("");
    setCorrect(0);
    setShowResult(false);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const saveScore = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, "quizScores"), {
        uid: user.uid,
        email: user.email,
        score: correct,
        total: questions.length,
        topic,
        type: "coding",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("❌ Failed to save score:", err);
    }
  };

  const handleAnswer = async () => {
    if (selected === questions[current].answer) {
      setCorrect(correct + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected("");
    } else {
      setShowResult(true);
      await saveScore();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">💻 Coding Practice</h1>

      {!questions.length ? (
        <div className="space-y-4">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border rounded p-2 bg-white text-black"
          >
            <option value="">Select a topic</option>
            {[
              "Arrays",
              "Strings",
              "Recursion",
              "Sorting",
              "Searching",
              "Stacks & Queues",
              "Trees",
              "Linked Lists",
              "Graphs",
              "Dynamic Programming",
            ].map((t) => (
              <option key={t} value={t.toLowerCase()}>
                {t}
              </option>
            ))}
          </select>

          <button
            onClick={loadQuestions}
            disabled={!topic || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Generating..." : "Start Quiz"}
          </button>
        </div>
      ) : showResult ? (
        <div className="text-lg font-semibold">
          🎉 You got {correct} out of {questions.length} correct!
        </div>
      ) : (
        <>
          <div className="mb-4 font-medium">{questions[current].question}</div>
          <div className="space-y-2">
            {questions[current].options.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`block w-full px-4 py-2 rounded border ${
                  selected === option
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleAnswer}
            disabled={!selected}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {current + 1 === questions.length ? "Finish" : "Next"}
          </button>
        </>
      )}
    </div>
  );
}
