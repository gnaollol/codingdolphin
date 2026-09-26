"use client";

import { useEffect, useState } from "react";

type Card = {
  id: string;
  front: string;
  back: string;
};

type Attempt = {
  id: string;
  score: number;
  total: number;
  createdAt: number;
};

type Score = {
  score: number;
  total: number;
};

export default function FlashcardQuizPage() {
  const [moduleId, setModuleId] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<
    { cardId: string; correct: boolean }[]
  >([]);
  const [score, setScore] = useState<Score | null>(null);
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

    async function loadQuiz() {
      try {
        const response = await fetch(
          `/api/flashcards?moduleId=${encodeURIComponent(id!)}`,
        );
        const data = (await response.json()) as Card[] & { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Could not load flashcards.");
        }

        // Shuffle the cards and use up to 20 per quiz.
        const shuffled = [...data];

        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        setCards(shuffled.slice(0, 20));

        const historyResponse = await fetch(
          `/api/flashcard-quiz?moduleId=${encodeURIComponent(id!)}`,
        );

        if (historyResponse.ok) {
          setAttempts((await historyResponse.json()) as Attempt[]);
        }
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Could not load quiz.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadQuiz();
  }, []);

  async function markAnswer(correct: boolean) {
    const card = cards[index];
    if (!card || saving) return;

    const updated = [...results, { cardId: card.id, correct }];

    if (index < cards.length - 1) {
      setResults(updated);
      setIndex(index + 1);
      setAnswer("");
      setRevealed(false);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/flashcard-quiz", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ moduleId, results: updated }),
      });

      const data = (await response.json()) as Score & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Could not save your quiz score.");
      }

      setResults(updated);
      setScore(data);
      setAttempts((current) => [
        {
          id: crypto.randomUUID(),
          score: data.score,
          total: data.total,
          createdAt: Date.now(),
        },
        ...current,
      ]);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save quiz.",
      );
    } finally {
      setSaving(false);
    }
  }

  function tryAgain() {
    setIndex(0);
    setAnswer("");
    setRevealed(false);
    setResults([]);
    setScore(null);
    setError("");
  }

  const card = cards[index];

  return (
    <main className="flashcard-quiz-page">
      <a href={`/flashcards?moduleId=${moduleId}`}>← Back to flashcards</a>
      <h1>Flashcard quiz</h1>

      {loading && <p>Loading quiz...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && cards.length === 0 && !error && (
        <p>Create at least one flashcard to start a quiz.</p>
      )}

      {score ? (
        <section className="flashcard-quiz-card">
          <h2>Quiz complete</h2>
          <p>
            You marked <strong>{score.score} of {score.total}</strong> correct.
          </p>
          <button type="button" onClick={tryAgain}>
            Try again
          </button>
        </section>
      ) : (
        card && (
          <section className="flashcard-quiz-card">
            <p className="flashcard-quiz-progress">
              Card {index + 1} of {cards.length}
            </p>

            <h2>{card.front}</h2>

            <label htmlFor="quiz-answer">Your answer</label>
            <textarea
              id="quiz-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={revealed}
              placeholder="Type what you remember..."
            />

            {!revealed ? (
              <button
                type="button"
                disabled={!answer.trim()}
                onClick={() => setRevealed(true)}
              >
                Reveal answer
              </button>
            ) : (
              <>
                <div className="flashcard-quiz-answer">
                  <strong>Saved answer</strong>
                  <p>{card.back}</p>
                </div>

                <p>Compare your answer, then grade yourself:</p>
                <div className="flashcard-quiz-buttons">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => markAnswer(false)}
                  >
                    Review again
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => markAnswer(true)}
                  >
                    Got it right
                  </button>
                </div>
              </>
            )}
          </section>
        )
      )}

      {attempts.length > 0 && (
        <section className="flashcard-quiz-history">
          <h2>Recent quiz results</h2>
          <ul>
            {attempts.slice(0, 5).map((attempt) => (
              <li key={attempt.id}>
                {attempt.score}/{attempt.total} correct ·{" "}
                {new Date(attempt.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}