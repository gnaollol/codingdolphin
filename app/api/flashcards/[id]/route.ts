import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getDb } from "@/db";
import { flashcards } from "@/db/schema";
import { createAuth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateSchema = z.object({
  front: z.string().trim().min(1).max(500),
  back: z.string().trim().min(1).max(2000),
});

async function getUserId(request: Request) {
  const session = await createAuth(request).api.getSession({
    headers: request.headers,
  });

  return session?.user.id;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Log in first." }, { status: 401 });
    }

    const { id } = await context.params;
    if (!z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ error: "Invalid card ID." }, { status: 400 });
    }

    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a question and answer." },
        { status: 400 },
      );
    }

    const updated = await getDb()
      .update(flashcards)
      .set({
        ...parsed.data,
        updatedAt: Date.now(),
      })
      .where(and(eq(flashcards.id, id), eq(flashcards.userId, userId)))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Update flashcard", error);
    return NextResponse.json(
      { error: "Could not update flashcard." },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Log in first." }, { status: 401 });
    }

    const { id } = await context.params;
    if (!z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ error: "Invalid card ID." }, { status: 400 });
    }

    const deleted = await getDb()
      .delete(flashcards)
      .where(and(eq(flashcards.id, id), eq(flashcards.userId, userId)))
      .returning({ id: flashcards.id });

    if (!deleted.length) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Delete flashcard", error);
    return NextResponse.json(
      { error: "Could not delete flashcard." },
      { status: 503 },
    );
  }
}