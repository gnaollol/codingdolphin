import { createAuth } from "@/lib/auth";

function handler(request: Request) {
  return createAuth(request).handler(request);
}

export const GET = handler;
export const POST = handler;