import { env } from "cloudflare:workers";
import { and, isNull, eq, like, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { attempts, modules, questionHistory } from "@/db/schema";
import {
  moduleSchema,
  outputSchema,
  SYSTEM_PROMPT,
  type ModuleRecord,
  requestSchema,
} from "@/lib/module";
import { builtIns, findBuiltIn } from "@/lib/builtins";
import type { z } from "zod";

type Query = z.infer<typeof requestSchema>;
const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();
const keyFor = (q: Query) =>
  JSON.stringify([normalize(q.question), q.language, q.style, q.depth]);
function unpack(row: typeof modules.$inferSelect, cached = true): ModuleRecord {
  return {
    ...moduleSchema.parse(JSON.parse(row.content)),
    id: row.id,
    question: row.question,
    language: row.language,
    style: row.style,
    depth: row.depth,
    createdAt: row.createdAt,
    cached,
  };
}
async function ensureBuiltIn(item: (typeof builtIns)[number], question: string) {
  const db = getDb();
  const cacheKey = JSON.stringify([normalize(question), "Python", "clear", "junior"]);
  await db
    .insert(modules)
    .values({
      id: crypto.randomUUID(),
      cacheKey,
      question,
      title: item.module.title,
      language: "Python",
      style: "clear",
      depth: "junior",
      content: JSON.stringify(item.module),
      createdAt: Date.now(),
    })
    .onConflictDoNothing();
  const row = await db
    .select()
    .from(modules)
    .where(eq(modules.cacheKey, cacheKey))
    .get();
  if (!row) throw new Error("BUILTIN_UNAVAILABLE");
  return unpack(row);
}
export async function getModule(q: Query) {
  const db = getDb();
  const cacheKey = keyFor(q);
  if (!q.regenerate) {
    const row = await db
      .select()
      .from(modules)
      .where(eq(modules.cacheKey, cacheKey))
      .get();
    if (row) return unpack(row);
    const builtIn =
      q.language === "Python" && q.style === "clear" && q.depth === "junior"
        ? findBuiltIn(q.question)
        : undefined;
    if (builtIn) return ensureBuiltIn(builtIn, q.question);
  }
  const apiKey = (env as Cloudflare.Env & { ANTHROPIC_API_KEY?: string })
    .ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_KEY_MISSING");
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Topic: ${q.question}\nLanguage: ${q.language}\nExplanation style: ${q.style}\nInterview depth: ${q.depth}`,
        },
      ],
      output_config: { format: { type: "json_schema", schema: outputSchema } },
    }),
  });
  if (!response.ok) {
    console.error(
      "Anthropic request failed",
      response.status,
      (await response.text()).slice(0, 400),
    );
    throw new Error("GENERATION_FAILED");
  }
  const result = (await response.json()) as {
    content?: { type: string; text?: string }[];
    stop_reason?: string;
  };
  if (result.stop_reason !== "end_turn") throw new Error("GENERATION_INCOMPLETE");
  const raw = result.content?.find((block) => block.type === "text")?.text;
  if (!raw) throw new Error("GENERATION_INCOMPLETE");
  const module = moduleSchema.parse(JSON.parse(raw));
  if (module.code.language !== q.language) throw new Error("GENERATION_INCOMPLETE");
  const ids = new Set(module.diagram.nodes.map((n) => n.id));
  if (module.diagram.edges.some((e) => !ids.has(e.from) || !ids.has(e.to)))
    throw new Error("GENERATION_INCOMPLETE");
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  const storageKey = q.regenerate
    ? JSON.stringify([cacheKey, "revision", id])
    : cacheKey;

  await db
    .insert(modules)
    .values({
      id,
      cacheKey: storageKey,
      question: q.question,
      title: module.title,
      language: q.language,
      style: q.style,
      depth: q.depth,
      content: JSON.stringify(module),
      createdAt,
    })
    .onConflictDoNothing();

  const stored = await db
    .select()
    .from(modules)
    .where(q.regenerate ? eq(modules.id, id) : eq(modules.cacheKey, cacheKey))
    .get();

  if (!stored) throw new Error("MODULE_SAVE_FAILED");
  return unpack(stored, stored.id !== id);
}
export async function searchTopics(term: string) {
  const safe = term
    .trim()
    .slice(0, 80)
    .replace(/[\\%_]/g, "\\$&");
  const stored = await getDb()
    .select({
      id: modules.id,
      title: modules.title,
      question: modules.question,
      language: modules.language,
      style: modules.style,
      depth: modules.depth,
    })
    .from(modules)
    .where(like(modules.title, `%${safe}%`))
    .orderBy(desc(modules.createdAt))
    .limit(8);
  const lookup = term.trim().toLowerCase();
  const starter = builtIns
    .filter(
      (item) =>
        item.module.title.toLowerCase().includes(lookup) ||
        item.aliases.some((a) => a.includes(lookup)),
    )
    .map((item) => ({
      id: `built-in:${item.slug}`,
      title: item.module.title,
      question: item.question,
      language: "Python",
      style: "clear",
      depth: "junior",
    }));
  return [
    ...stored,
    ...starter.filter((item) => !stored.some((row) => row.title === item.title)),
  ].slice(0, 8);
}
export async function getModuleById(id: string) {
  if (id.startsWith("built-in:")) {
    const item = builtIns.find((entry) => entry.slug === id.slice(9));
    return item ? ensureBuiltIn(item, item.question) : null;
  }
  const row = await getDb().select().from(modules).where(eq(modules.id, id)).get();
  return row ? unpack(row) : null;
}
export async function saveAttempt(
  visitorId: string,
  moduleId: string,
  answers: number[],
  userId?: string,
) {
  const db = getDb();
  const row = await db.select().from(modules).where(eq(modules.id, moduleId)).get();
  if (!row) return null;
  const module = moduleSchema.parse(JSON.parse(row.content));
  if (
    answers.length !== module.quiz.length ||
    answers.some((a) => !Number.isInteger(a) || a < 0 || a > 3)
  )
    throw new Error("INVALID_ANSWERS");
  const score = answers.filter((a, i) => a === module.quiz[i].correctIndex).length;
  await db.insert(attempts).values({
    userId: userId ?? null,
    id: crypto.randomUUID(),
    visitorId,
    moduleId,
    score,
    total: answers.length,
    createdAt: Date.now(),
  });
  return { score, total: answers.length };
}
export async function claimVisitorAttempts(visitorId: string, userId: string) {
  await getDb()
    .update(attempts)
    .set({ userId })
    .where(and(eq(attempts.visitorId, visitorId), isNull(attempts.userId)));
}
export async function getProgress(visitorId: string, userId?: string) {
  return getDb()
    .select({
      title: modules.title,
      question: modules.question,
      score: attempts.score,
      total: attempts.total,
      createdAt: attempts.createdAt,
    })
    .from(attempts)
    .innerJoin(modules, eq(attempts.moduleId, modules.id))
    .where(
      userId
        ? eq(attempts.userId, userId)
        : and(eq(attempts.visitorId, visitorId), isNull(attempts.userId)),
    )
    .orderBy(desc(attempts.createdAt))
    .limit(30);
}

export async function recordQuestion(
  userId: string,
  moduleId: string,
  question: string,
) {
  await getDb().insert(questionHistory).values({
    id: crypto.randomUUID(),
    userId,
    moduleId,
    question,
    createdAt: Date.now(),
  });
}
