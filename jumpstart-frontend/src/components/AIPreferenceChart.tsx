"use client";

import React, { useEffect, useState } from "react";
import { aiPersonalization } from "@/lib/aiLogic";

type Preference = {
  category: string;
  score: number;
};

export default function AIPreferenceChart() {
  const [data, setData] = useState<Preference[]>([]);

  useEffect(() => {
    // ✅ Prevents undefined issues in SSR
    if (typeof window !== "undefined") {
      setData(aiPersonalization.getPreferenceSummary());
    }
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 border border-gray-100">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        🧠 Your AI Feed Preferences
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500">No data yet — start exploring content!</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item) => (
            <li
              key={item.category}
              className="flex justify-between border-b border-gray-100 pb-1"
            >
              <span className="capitalize">{item.category}</span>
              <span className="text-blue-600 font-semibold">
                {item.score.toFixed(1)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
