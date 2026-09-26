import {and, desc, eq}from "drizzle-orm";
import {NextResponse} from "next/server";
import {z} from "zod";

import {getDb} from "@/db";
import {flashcards, savedModules} from "@/db/schema";
import{createAuth} from "@/lib/auth";

const moduleIdSchema = z.string().uuid();

const cardSchema = z.object({
    moduleId: moduleIdSchema,
    front: z.string().trim().min(1).max(500),
    back: z.string().trim().min(1).max(2000),
});

async function getUserId(request : Request){
    const session = await createAuth(request).api.getSession({
        headers: request.headers,
});

return session?.user?.id;
}

async function hasSavedModule(userId: string, moduleId: string) {
  const rows = await getDb()
    .select({ id: savedModules.id })
    .from(savedModules)
    .where(
      and(
        eq(savedModules.userId, userId),
        eq(savedModules.moduleId, moduleId),
      ),
    )
    .limit(1);

  return rows.length > 0;
}

export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Log in first." }, { status: 401 });
    }

    const url = new URL(request.url);
    const parsed = moduleIdSchema.safeParse(url.searchParams.get("moduleId"));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid module ID." },
        { status: 400 },
      );
    }

    const moduleId = parsed.data;

    if (!(await hasSavedModule(userId, moduleId))) {
      return NextResponse.json(
        { error: "Save this topic before creating flashcards." },
        { status: 403 },
      );
    }

    const cards = await getDb()
      .select()
      .from(flashcards)
      .where(
        and(
          eq(flashcards.userId, userId),
          eq(flashcards.moduleId, moduleId),
        ),
      )
      .orderBy(desc(flashcards.createdAt));

    return NextResponse.json(cards);
  } catch (error) {
    console.error("List flashcards", error);
    return NextResponse.json(
      { error: "Could not load flashcards." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Log in first." }, { status: 401 });
    }

    const parsed = cardSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a question and answer." },
        { status: 400 },
      );
    }

    const { moduleId, front, back } = parsed.data;

    if (!(await hasSavedModule(userId, moduleId))) {
      return NextResponse.json(
        { error: "Save this topic before creating flashcards." },
        { status: 403 },
      );
    }

    const now = Date.now();
    const card = {
      id: crypto.randomUUID(),
      userId,
      moduleId,
      front,
      back,
      createdAt: now,
      updatedAt: now,
    };

    await getDb().insert(flashcards).values(card);

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error("Create flashcard", error);
    return NextResponse.json(
      { error: "Could not create flashcard." },
      { status: 503 },
    );
  }
}