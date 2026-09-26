import { NextResponse } from "next/server";
import { getModuleById } from "@/lib/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const module = await getModuleById(id);
    return module
      ? NextResponse.json(module)
      : NextResponse.json({ error: "Module not found." }, { status: 404 });
  } catch (error) {
    console.error("Module lookup", error);
    return NextResponse.json({ error: "Module unavailable." }, { status: 503 });
  }
}
