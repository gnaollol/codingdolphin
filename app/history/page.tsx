"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  moduleId: string;
  question: string;
  title: string;
  createdAt: number;
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/history")
      .then(async (response) => {
        if (response.status === 401) {
          throw new Error("Log in to see your history.");
        }
        if (!response.ok) throw new Error("Could not load history.");
        return (await response.json()) as HistoryItem[];
      })
      .then(setItems)
      .catch((problem) => setError(problem.message));
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f7f7] px-4 py-12">
      <section className="mx-auto max-w-2xl">
        <a href="/" className="text-sm text-[#195d59] underline">
          ← Back to study desk
        </a>
        <h1 className="mt-6 text-3xl font-bold">Your question history</h1>

        {error && (
          <p className="mt-5">
            {error} <a href="/login" className="underline">Log in</a>
          </p>
        )}

        {!error && items.length === 0 && (
          <p className="mt-5 text-[#64767a]">No questions yet. Ask one to start.</p>
        )}

        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={`/study?module=${item.moduleId}`}
              className="block rounded-xl border bg-white p-4 hover:border-[#195d59]"
            >
              <strong>{item.title}</strong>
              <p className="mt-1 text-sm text-[#64767a]">{item.question}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}