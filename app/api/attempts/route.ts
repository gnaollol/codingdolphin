import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAuth } from "@/lib/auth";
import {
  claimVisitorAttempts,
  getProgress,
  saveAttempt,
} from "@/lib/server";

const bodySchema = z.object({
  moduleId: z.string().uuid(),
  answers: z.array(z.number().int().min(0).max(3)).min(3).max(5),
});

const cookieName = "interviewprep_visitor";

export async function POST(request: NextRequest) {
  try {
    const { moduleId, answers } = bodySchema.parse(await request.json());
    const visitorId = request.cookies.get(cookieName)?.value ?? crypto.randomUUID();
    const session = await createAuth(request).api.getSession({
      headers: request.headers,
    });

    const result = await saveAttempt(
      visitorId,
      moduleId,
      answers,
      session?.user.id,
    );

    if (!result) {
      return NextResponse.json({ error: "Module not found." }, { status: 404 });
    }

    const response = NextResponse.json(result);
    response.cookies.set(cookieName, visitorId, {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "ZodError" || error.message === "INVALID_ANSWERS")
    ) {
      return NextResponse.json(
        { error: "Answer every question before submitting." },
        { status: 400 },
      );
    }

    console.error("Save attempt", error);
    return NextResponse.json(
      { error: "Could not save your quiz score." },
      { status: 503 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const visitorId = request.cookies.get(cookieName)?.value;
    const session = await createAuth(request).api.getSession({
      headers: request.headers,
    });

    if (session?.user) {
      if (visitorId) {
        await claimVisitorAttempts(visitorId, session.user.id);
      }
      return NextResponse.json(
        await getProgress(visitorId ?? "", session.user.id),
      );
    }

    return NextResponse.json(visitorId ? await getProgress(visitorId) : []);
  } catch (error) {
    console.error("Progress", error);
    return NextResponse.json(
      { error: "Progress is unavailable." },
      { status: 503 },
    );
  }
}