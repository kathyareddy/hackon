"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [aptitudeData, setAptitudeData] = useState([]);
  const [codingData, setCodingData] = useState([]);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const q = query(
        collection(db, "quizScores"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const raw = snapshot.docs.map((doc) => doc.data());
      setTotalAttempts(raw.length);

      const topicStats = {
        aptitude: {},
        coding: {},
      };

      raw.forEach((entry) => {
        const { topic = "Unknown", type = "aptitude", score, total } = entry;
        const key = topic.toLowerCase();

        if (!topicStats[type][key]) {
          topicStats[type][key] = { totalScore: 0, totalQ: 0 };
        }

        topicStats[type][key].totalScore += score;
        topicStats[type][key].totalQ += total;
      });

      const toChartData = (obj) =>
        Object.entries(obj).map(([topic, val]) => ({
          topic: topic.charAt(0).toUpperCase() + topic.slice(1),
          accuracy: Math.round((val.totalScore / val.totalQ) * 100),
        }));

      setAptitudeData(toChartData(topicStats.aptitude));
      setCodingData(toChartData(topicStats.coding));
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#fdf8f2] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">
        Dashboard
      </h1>

      {!user ? (
        <p className="text-center text-gray-500">
          Please log in to view stats.
        </p>
      ) : (
        <>
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-800 font-medium">
              You’ve attempted{" "}
              <span className="text-blue-700 font-bold">{totalAttempts}</span>{" "}
              quizzes so far!
            </p>
          </div>

          {/* Aptitude Chart */}
          <div className="bg-white rounded-xl shadow p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              Aptitude Accuracy by Topic
            </h2>
            {aptitudeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aptitudeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar
                    dataKey="accuracy"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No aptitude data available.</p>
            )}
          </div>

          {/* Coding Chart */}
          <div className="bg-white rounded-xl shadow p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Coding Accuracy by Topic
            </h2>
            {codingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={codingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar
                    dataKey="accuracy"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No coding data available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
