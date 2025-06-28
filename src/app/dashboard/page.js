"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      if (!user) return;

      const scoresRef = collection(db, "quizScores");
      const q = query(
        scoresRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const history = snapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.(),
      }));
      setQuizHistory(history.reverse()); // for chart: oldest to latest
    };

    fetchQuizHistory();
  }, [user]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">📊 Quiz History</h1>

      {!user ? (
        <p className="text-center text-gray-500">
          Please log in to view history.
        </p>
      ) : quizHistory.length === 0 ? (
        <p className="text-center text-gray-500">No quiz attempts found.</p>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">📈 Score Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={quizHistory.map((q, i) => ({
                  name: `#${i + 1}`,
                  score: q.score,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#f5f5dc", fontSize: 14, fontWeight: "bold" }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4">
            {quizHistory.map((entry, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
              >
                <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  Attempt #{quizHistory.length - idx}
                </div>
                <div className="mt-2 text-gray-700 dark:text-gray-200">
                  ✅ Correct: {entry.score} / {entry.total}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  📅 {entry.createdAt?.toLocaleString?.() || "Unknown Date"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
