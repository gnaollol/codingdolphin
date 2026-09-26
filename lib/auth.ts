import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";

import { getDb } from "@/db";
import * as authSchema from "@/db/auth-schema";

export function createAuth(request: Request) {
  if (!env.BETTER_AUTH_SECRET) {
    throw new Error("Auth secret is not configured.");
  }

  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: "sqlite",
      schema: authSchema,
    }),

    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL ?? new URL(request.url).origin,
    emailAndPassword: { enabled: true },

    plugins: [
      username({
        displayUsername: false,
        minUsernameLength: 1,
        maxUsernameLength: 20,
        usernameValidator: (value) => /^[A-Za-z0-9]{1,20}$/.test(value),
      }),
    ],

    socialProviders:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {},
  });
}