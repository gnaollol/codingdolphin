import { and, eq, gt, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { codingSubmissions } from "@/db/schema";
import { createAuth } from "@/lib/auth";
import { codingProblems } from "@/lib/coding-problems";
import { getProfileStats } from "@/lib/profile-stats";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const session = await createAuth(
      request as Parameters<typeof createAuth>[0],
    ).api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json(
        { error: "Log in to view your activity." },
        { status: 401, headers },
      );
    }
    // Aggregate in D1: no source code or other users' records leave the database.
    const day = sql<string>`strftime('%Y-%m-%d', ${codingSubmissions.createdAt} / 1000, 'unixepoch')`;
    const rows = await getDb()
      .select({
        day,
        problemSlug: codingSubmissions.problemSlug,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(codingSubmissions)
      .where(
        and(
          eq(codingSubmissions.userId, session.user.id),
          eq(codingSubmissions.passed, codingSubmissions.total),
          gt(codingSubmissions.total, 0),
          lte(codingSubmissions.createdAt, Date.now()),
        ),
      )
      .groupBy(day, codingSubmissions.problemSlug);
    return NextResponse.json(getProfileStats(rows, codingProblems), {
      headers,
    });
  } catch (error) {
    console.error("Load profile activity", error);
    return NextResponse.json(
      { error: "Could not load your activity. Please try again." },
      { status: 503, headers },
    );
  }
}
