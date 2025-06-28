"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const questions = [
  {
    question: "What comes next in the series? 2, 4, 8, 16, ?",
    options: ["18", "24", "32", "34"],
    answer: "32",
  },
  {
    question: "If A = 1, B = 2, ..., what is the value of ACE?",
    options: ["9", "10", "11", "12"],
    answer: "9",
  },
  {
    question: "Which number is divisible by both 3 and 5?",
    options: ["10", "15", "21", "30"],
    answer: "15",
  },
];

export default function AptitudePage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [user, setUser] = useState(null);

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
      <h1 className="text-2xl font-bold mb-4">🧠 Aptitude Practice</h1>

      {showResult ? (
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
