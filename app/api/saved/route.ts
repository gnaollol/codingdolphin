import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { modules, savedModules } from "@/db/schema";

const bodySchema = z.object({ moduleId: z.string().uuid() });

async function getUserId(request: Request) {
  const session = await createAuth(request).api.getSession({
    headers: request.headers,
  });
  return session?.user.id;
}

export async function GET(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    return Response.json({ error: "Please log in." }, { status: 401 });
  }

  const items = await getDb()
    .select({
      moduleId: savedModules.moduleId,
      title: modules.title,
      question: modules.question,
      savedAt: savedModules.createdAt,
    })
    .from(savedModules)
    .innerJoin(modules, eq(savedModules.moduleId, modules.id))
    .where(eq(savedModules.userId, userId))
    .orderBy(desc(savedModules.createdAt))
    .limit(100);

  return Response.json(items);
}

export async function POST(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    return Response.json({ error: "Please log in." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid module ID." }, { status: 400 });
  }

  const db = getDb();
  const moduleId = parsed.data.moduleId;
  const module = await db
    .select({ id: modules.id })
    .from(modules)
    .where(eq(modules.id, moduleId))
    .get();

  if (!module) {
    return Response.json({ error: "Module not found." }, { status: 404 });
  }

  await db
    .insert(savedModules)
    .values({
      id: crypto.randomUUID(),
      userId,
      moduleId,
      createdAt: Date.now(),
    })
    .onConflictDoNothing();

  return Response.json({ saved: true });
}

export async function DELETE(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    return Response.json({ error: "Please log in." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid module ID." }, { status: 400 });
  }

  await getDb()
    .delete(savedModules)
    .where(
      and(
        eq(savedModules.userId, userId),
        eq(savedModules.moduleId, parsed.data.moduleId),
      ),
    );

  return Response.json({ saved: false });
}