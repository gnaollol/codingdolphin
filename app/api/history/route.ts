import { desc, eq } from "drizzle-orm";
import { createAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { modules, questionHistory } from "@/db/schema";

export async function GET(request: Request) {
  const session = await createAuth(request).api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return Response.json({ error: "Please log in." }, { status: 401 });
  }

  const history = await getDb()
    .select({
      id: questionHistory.id,
      question: questionHistory.question,
      moduleId: questionHistory.moduleId,
      title: modules.title,
      language: modules.language,
      style: modules.style,
      depth: modules.depth,
      createdAt: questionHistory.createdAt,
    })
    .from(questionHistory)
    .innerJoin(modules, eq(questionHistory.moduleId, modules.id))
    .where(eq(questionHistory.userId, session.user.id))
    .orderBy(desc(questionHistory.createdAt))
    .limit(50);

  return Response.json(history);
}