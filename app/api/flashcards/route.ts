import { NextRequest, NextResponse } from "next/server";
import { requestSchema } from "@/lib/module";
import { getModule, recordQuestion, searchTopics } from "@/lib/server";
import { createAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const payload = requestSchema.parse(await request.json());
    const module = await getModule(payload);
    const session = await createAuth(request).api.getSession({
      headers: request.headers,
    });

    if (session?.user) {
      await recordQuestion(session.user.id, module.id, payload.question);
    }

    return NextResponse.json(module);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError")
      return NextResponse.json(
        { error: "Check the question and options, then try again." },
        { status: 400 },
      );
    const message =
      error instanceof Error && error.message === "ANTHROPIC_KEY_MISSING"
        ? "Generation is not configured yet. Add an Anthropic API key to enable new topics."
        : "Could not generate this module. Please try again.";
    console.error("Module generation", error);
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
export async function GET(request: NextRequest) {
  try {
    const term = request.nextUrl.searchParams.get("q") ?? "";
    return NextResponse.json(await searchTopics(term));
  } catch (error) {
    console.error("Topic search", error);
    return NextResponse.json(
      { error: "Topic search is unavailable." },
      { status: 503 },
    );
  }
}
