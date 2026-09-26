"use client";

import { useEffect, useState } from "react";

type SavedItem = {
    moduleId: string;
    title: string;
    question: string;
    savedAt: number;
};

export default function SavedPage() {
    const [items, setItems] = useState<SavedItem[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/saved")
            .then(async (response) => {
                if (response.status === 401) throw new Error("Log in to see saved topics.");
                if (!response.ok) throw new Error("Could not load saved topics.");
                return (await response.json()) as SavedItem[];
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
                <h1 className="mt-6 text-3xl font-bold">Saved topics</h1>

                {error && (
                    <p className="mt-5">
                        {error} <a href="/login" className="underline">Log in</a>
                    </p>
                )}

                {!error && items.length === 0 && (
                    <p className="mt-5 text-[#64767a]">Nothing saved yet.</p>
                )}

                <div className="mt-6 space-y-3">
                    {items.map((item) => (
                        <article
                            key={item.moduleId}
                            className="overflow-hidden rounded-xl border bg-white hover:border-[#195d59]"
                        >
                            <a
                                href={`/study?module=${item.moduleId}`}
                                className="block p-4"
                            >
                                <strong>{item.title}</strong>
                                <p className="mt-1 text-sm text-[#64767a]">{item.question}</p>
                            </a>

                            <a
                                href={`/flashcards?moduleId=${item.moduleId}`}
                                className="block border-t px-4 py-3 text-sm font-semibold text-[#195d59] hover:bg-[#e6f1ef]"
                            >
                                Create or review flashcards →
                            </a>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}