import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getDb } from "@/db";
import { codingSubmissions } from "@/db/schema";
import { createAuth } from "@/lib/auth";
import { codingProblems } from "@/lib/coding-problems";

const input = z.object({
  problemSlug: z.string(),
  language: z.enum(["Python", "Java", "C++", "C#"]),
  code: z.string().min(1).max(20_000),
});

const runnerOutput = z.object({
  passed: z.array(z.boolean()),
  actuals: z.array(z.unknown()),
  testErrors: z.array(z.string().nullable()),
  error: z.string().nullable(),
});

type RunnerBinding = {
  fetch(input: string, init: RequestInit): Promise<Response>;
};

export async function POST(request: Request) {
  const session = await createAuth(
    request as Parameters<typeof createAuth>[0],
  ).api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json(
      { error: "Log in to run compiled code." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = input.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid language or solution." },
      { status: 400 },
    );
  }

  const problem = codingProblems.find(
    (item) => item.slug === parsed.data.problemSlug,
  );
  if (!problem) {
    return NextResponse.json({ error: "Unknown problem." }, { status: 400 });
  }

  const bindings = env as unknown as {
    CODING_RUNNER?: RunnerBinding;
    RUNNER_TOKEN?: string;
  };
  if (!bindings.CODING_RUNNER || !bindings.RUNNER_TOKEN) {
    return NextResponse.json(
      { error: "Code runner is not configured." },
      { status: 503 },
    );
  }

  try {
    const runnerResponse = await bindings.CODING_RUNNER.fetch(
      "https://codingdolphin-runner/run",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bindings.RUNNER_TOKEN}`,
        },
        body: JSON.stringify({
          problem: problem.slug,
          language: parsed.data.language,
          code: parsed.data.code,
        }),
      },
    );

    if (!runnerResponse.ok) {
      console.error("Runner response status", runnerResponse.status);
      return NextResponse.json(
        {
          error: "Code runner is unavailable.",
          runnerStatus: runnerResponse.status,
        },
        { status: 502 },
      );
    }

    const result = runnerOutput.safeParse(await runnerResponse.json());
    if (
      !result.success ||
      result.data.passed.length !== problem.tests.length ||
      result.data.actuals.length !== problem.tests.length ||
      result.data.testErrors.length !== problem.tests.length
    ) {
      return NextResponse.json(
        { error: "Invalid runner response." },
        { status: 502 },
      );
    }

    const passedCount = result.data.passed.filter(Boolean).length;
    // Failed runs are reported to the editor but never replace the accepted solution.
    if (passedCount !== problem.tests.length || result.data.error) {
      return NextResponse.json({
        passed: result.data.passed,
        actuals: result.data.actuals,
        testErrors: result.data.testErrors,
        passedCount,
        total: problem.tests.length,
        error: result.data.error,
        saved: false,
        submission: null,
      });
    }

    const submission = {
      id: crypto.randomUUID(),
      userId: session.user.id,
      problemSlug: problem.slug,
      language: parsed.data.language,
      code: parsed.data.code,
      passed: passedCount,
      total: problem.tests.length,
      createdAt: Date.now(),
    };
    let saved = true;
    try {
      await getDb().insert(codingSubmissions).values(submission);
    } catch (error) {
      saved = false;
      console.error("Save compiled attempt", error);
    }

    return NextResponse.json({
      passed: result.data.passed,
      actuals: result.data.actuals,
      testErrors: result.data.testErrors,
      passedCount,
      total: problem.tests.length,
      error: result.data.error,
      saved,
      submission: saved
        ? {
            id: submission.id,
            code: submission.code,
            passed: submission.passed,
            total: submission.total,
            createdAt: submission.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Code runner request failed", error);
    return NextResponse.json(
      { error: "Code runner is unavailable." },
      { status: 503 },
    );
  }
}
