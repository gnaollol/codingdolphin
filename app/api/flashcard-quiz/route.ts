import { and, desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getDb } from "@/db";
import { flashcards, flashcardQuizAttempts } from "@/db/schema";
import { createAuth } from "@/lib/auth";

const resultSchema = z.object({
  moduleId: z.string().uuid(),
  results: z
    .array(
      z.object({
        cardId: z.string().uuid(),
        correct: z.boolean(),
      }),
    )
    .min(1)
    .max(100),
});

async function getUserId(request: Request) {
  const session = await createAuth(request).api.getSession({
    headers: request.headers,
  });

  return session?.user.id;
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Log in first." }, { status: 401 });
    }

    const parsed = resultSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid quiz results." },
        { status: 400 },
      );
    }

    const { moduleId, results } = parsed.data;
    const cardIds = results.map((result) => result.cardId);

    if (new Set(cardIds).size !== cardIds.length) {
      return NextResponse.json(
        { error: "A card was submitted more than once." },
        { status: 400 },
      );
    }

    const ownedCards = await getDb()
      .select({ id: flashcards.id })
      .from(flashcards)
      .where(
        and(
          eq(flashcards.userId, userId),
          eq(flashcards.moduleId, moduleId),
          inArray(flashcards.id, cardIds),
        ),
      );

    if (ownedCards.length !== cardIds.length) {
      return NextResponse.json(
        { error: "One or more cards no longer exist." },
        { status: 400 },
      );
    }

    const attempt = {
      id: crypto.randomUUID(),
      userId,
      moduleId,
      score: results.filter((result) => result.correct).length,
      total: results.length,
      createdAt: Date.now(),
    };

    await getDb().insert(flashcardQuizAttempts).values(attempt);

    return NextResponse.json({
      score: attempt.score,
      total: attempt.total,
    });
  } catch (error) {
    console.error("Save flashcard quiz", error);
    return NextResponse.json(
      { error: "Could not save quiz result." },
      { status: 503 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Log in first." }, { status: 401 });
    }

    const moduleId = new URL(request.url).searchParams.get("moduleId");
    if (!moduleId || !z.string().uuid().safeParse(moduleId).success) {
      return NextResponse.json(
        { error: "Invalid module ID." },
        { status: 400 },
      );
    }

    const attempts = await getDb()
      .select()
      .from(flashcardQuizAttempts)
      .where(
        and(
          eq(flashcardQuizAttempts.userId, userId),
          eq(flashcardQuizAttempts.moduleId, moduleId),
        ),
      )
      .orderBy(desc(flashcardQuizAttempts.createdAt))
      .limit(10);

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("Flashcard quiz history", error);
    return NextResponse.json(
      { error: "Could not load quiz results." },
      { status: 503 },
    );
  }
}