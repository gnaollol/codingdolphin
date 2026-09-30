import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getDb } from "@/db";
import { codingDrafts, codingSubmissions } from "@/db/schema";
import { createAuth } from "@/lib/auth";
import { codingProblems } from "@/lib/coding-problems";

const languages = z.enum(["JavaScript", "Python", "Java", "C++", "C#"]);
const input = z.object({
  problemSlug: z.string(),
  language: languages,
  code: z.string().max(20_000),
});
const jsAttempt = input.extend({
  language: z.literal("JavaScript"),
  passed: z.number().int().min(0),
});

function findProblem(slug: string) {
  return codingProblems.find((problem) => problem.slug === slug);
}

async function getUserId(request: Request) {
  const session = await createAuth(
    request as Parameters<typeof createAuth>[0],
  ).api.getSession({ headers: request.headers });
  return session?.user.id;
}

export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId)
      return NextResponse.json(
        { error: "Log in to sync solutions." },
        { status: 401 },
      );

    const url = new URL(request.url);
    const problemSlug = url.searchParams.get("problem") ?? "";
    const language = languages.safeParse(url.searchParams.get("language"));
    if (!findProblem(problemSlug) || !language.success) {
      return NextResponse.json(
        { error: "Invalid problem or language." },
        { status: 400 },
      );
    }

    const db = getDb();
    const [draft, submissions] = await Promise.all([
      db
        .select({ code: codingDrafts.code, updatedAt: codingDrafts.updatedAt })
        .from(codingDrafts)
        .where(
          and(
            eq(codingDrafts.userId, userId),
            eq(codingDrafts.problemSlug, problemSlug),
            eq(codingDrafts.language, language.data),
          ),
        )
        .get(),
      db
        .select({
          id: codingSubmissions.id,
          code: codingSubmissions.code,
          passed: codingSubmissions.passed,
          total: codingSubmissions.total,
          createdAt: codingSubmissions.createdAt,
        })
        .from(codingSubmissions)
        .where(
          and(
            eq(codingSubmissions.userId, userId),
            eq(codingSubmissions.problemSlug, problemSlug),
            eq(codingSubmissions.language, language.data),
            eq(codingSubmissions.passed, codingSubmissions.total),
          ),
        )
        .orderBy(desc(codingSubmissions.createdAt))
        .limit(1),
    ]);
    return NextResponse.json({
      draft: draft?.code ?? null,
      draftUpdatedAt: draft?.updatedAt ?? 0,
      submissions,
    });
  } catch (error) {
    console.error("Load coding progress", error);
    return NextResponse.json(
      { error: "Coding progress is unavailable." },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId)
      return NextResponse.json(
        { error: "Log in to sync solutions." },
        { status: 401 },
      );
    const parsed = input.safeParse(await request.json());
    if (!parsed.success || !findProblem(parsed.data.problemSlug)) {
      return NextResponse.json({ error: "Invalid solution." }, { status: 400 });
    }

    const { problemSlug, language, code } = parsed.data;
    await getDb()
      .insert(codingDrafts)
      .values({
        id: crypto.randomUUID(),
        userId,
        problemSlug,
        language,
        code,
        updatedAt: Date.now(),
      })
      .onConflictDoUpdate({
        target: [
          codingDrafts.userId,
          codingDrafts.problemSlug,
          codingDrafts.language,
        ],
        set: { code, updatedAt: Date.now() },
      });
    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("Save coding draft", error);
    return NextResponse.json(
      { error: "Could not sync this draft." },
      { status: 503 },
    );
  }
}

// JavaScript runs in the browser. This is personal attempt history, so its score
// is client-reported; compiled-language scores are saved by the trusted run route.
export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId)
      return NextResponse.json(
        { error: "Log in to save attempts." },
        { status: 401 },
      );
    const parsed = jsAttempt.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid attempt." }, { status: 400 });
    const problem = findProblem(parsed.data.problemSlug);
    if (!problem || parsed.data.passed !== problem.tests.length) {
      return NextResponse.json({ error: "Invalid attempt." }, { status: 400 });
    }

    const submission = {
      id: crypto.randomUUID(),
      userId,
      problemSlug: problem.slug,
      language: "JavaScript",
      code: parsed.data.code,
      passed: parsed.data.passed,
      total: problem.tests.length,
      createdAt: Date.now(),
    };
    await getDb().insert(codingSubmissions).values(submission);
    return NextResponse.json(
      {
        submission: {
          id: submission.id,
          code: submission.code,
          passed: submission.passed,
          total: submission.total,
          createdAt: submission.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Save JavaScript attempt", error);
    return NextResponse.json(
      { error: "Could not save this attempt." },
      { status: 503 },
    );
  }
}
