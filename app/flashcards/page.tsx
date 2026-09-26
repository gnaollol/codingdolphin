"use client";

import { useEffect, useState, type FormEvent } from "react";

type Flashcard = {
    id: string;
    moduleId: string;
    front: string;
    back: string;
    createdAt: number;
    updatedAt: number;
};

export default function FlashcardsPage() {
    const [moduleId, setModuleId] = useState("");
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [revealedId, setRevealedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("moduleId");

        if (!id) {
            setError("Choose a saved topic first.");
            setLoading(false);
            return;
        }

        setModuleId(id);

        fetch(`/api/flashcards?moduleId=${encodeURIComponent(id)}`)
            .then(async (response) => {
                const data = (await response.json()) as Flashcard[] & {
                    error?: string;
                };
                if (!response.ok) {
                    throw new Error(data.error ?? "Could not load flashcards.");
                }
                return data as Flashcard[];
            })
            .then(setCards)
            .catch((cause) => setError(cause.message))
            .finally(() => setLoading(false));
    }, []);

    async function saveCard(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!front.trim() || !back.trim() || !moduleId) return;

        setSaving(true);
        setError("");

        try {
            const response = await fetch(
                editingId ? `/api/flashcards/${editingId}` : "/api/flashcards",
                {
                    method: editingId ? "PUT" : "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        moduleId,
                        front: front.trim(),
                        back: back.trim(),
                    }),
                },
            );

            const data = (await response.json()) as Flashcard & { error?: string };
            if (!response.ok) {
                throw new Error(data.error ?? "Could not save flashcard.");
            }

            setCards((current) =>
                editingId
                    ? current.map((card) => (card.id === editingId ? data : card))
                    : [data, ...current],
            );

            setFront("");
            setBack("");
            setEditingId(null);
            setRevealedId(null);
        } catch (cause) {
            setError(
                cause instanceof Error ? cause.message : "Could not save flashcard.",
            );
        } finally {
            setSaving(false);
        }
    }

    async function deleteCard(id: string) {
        if (!window.confirm("Delete this flashcard?")) return;

        setError("");

        try {
            const response = await fetch(`/api/flashcards/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = (await response.json()) as { error?: string };
                throw new Error(data.error ?? "Could not delete flashcard.");
            }

            setCards((current) => current.filter((card) => card.id !== id));

            if (editingId === id) {
                setEditingId(null);
                setFront("");
                setBack("");
            }
        } catch (cause) {
            setError(
                cause instanceof Error ? cause.message : "Could not delete flashcard.",
            );
        }
    }

    return (
        <main className="flashcards-page">
            <a href="/saved">← Saved topics</a>
            <h1>Flashcards</h1>
            <p>Create question and answer cards for this saved topic.</p>

            {moduleId && (
                <a href={`/study?module=${moduleId}`}>Open the study module →</a>
            )}

            {moduleId && cards.length > 0 && (
                <a
                    href={`/flashcards/quiz?moduleId=${encodeURIComponent(moduleId)}`}
                    className="flashcard-start-quiz"
                >
                    Start quiz ({cards.length} {cards.length === 1 ? "card" : "cards"}) →
                </a>
            )}

            <form onSubmit={saveCard} className="flashcard-form">
                <h2>{editingId ? "Edit flashcard" : "New flashcard"}</h2>

                <label htmlFor="card-front">Question</label>
                <textarea
                    id="card-front"
                    value={front}
                    onChange={(event) => setFront(event.target.value)}
                    maxLength={500}
                    required
                />

                <label htmlFor="card-back">Answer</label>
                <textarea
                    id="card-back"
                    value={back}
                    onChange={(event) => setBack(event.target.value)}
                    maxLength={2000}
                    required
                />

                <div className="flashcard-actions">
                    <button type="submit" disabled={saving || !moduleId}>
                        {saving ? "Saving..." : editingId ? "Save changes" : "Add flashcard"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setFront("");
                                setBack("");
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {error && <p role="alert">{error}</p>}
            {loading && <p>Loading cards...</p>}

            {!loading && !error && cards.length === 0 && (
                <p>No flashcards yet. Add your first one above.</p>
            )}

            <div className="flashcard-list">
                {cards.map((card) => (
                    <article className="flashcard-item" key={card.id}>
                        <h2>{card.front}</h2>

                        {revealedId === card.id ? (
                            <p>{card.back}</p>
                        ) : (
                            <p className="flashcard-hidden">Answer hidden</p>
                        )}

                        <div className="flashcard-actions">
                            <button
                                type="button"
                                onClick={() =>
                                    setRevealedId(revealedId === card.id ? null : card.id)
                                }
                            >
                                {revealedId === card.id ? "Hide answer" : "Show answer"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(card.id);
                                    setFront(card.front);
                                    setBack(card.back);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            >
                                Edit
                            </button>

                            <button type="button" onClick={() => deleteCard(card.id)}>
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}