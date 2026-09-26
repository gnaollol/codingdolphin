# InterviewPrep AI — independent Cloudflare deployment

This is a standalone copy of the full-stack app. It uses React/TypeScript with vinext on Cloudflare Workers, a D1 SQLite database for modules and quiz scores, and the Anthropic Messages API for new lessons. It does not depend on ChatGPT Sites.

## Where to edit the site

| Change                                     | File                                |
| ------------------------------------------ | ----------------------------------- |
| Browser tab title                          | `app/layout.tsx` (`metadata.title`) |
| Top-left site name and main page           | `app/page.tsx`                      |
| Colors, spacing, layout, and mobile styles | `app/globals.css`                   |
| Built-in lessons                           | `lib/builtins.ts`                   |
| AI generation and API routes               | `lib/server.ts` and `app/api/`      |

The files are formatted for editing in VS Code. After installing dependencies, run `npm run format` to format future edits, or `npm run format:check` to check formatting without changing files.

## What you need

- Node.js 22.13+ and a Cloudflare account.
- An Anthropic API key.
- For a custom domain, a domain you own and an active Cloudflare DNS zone. You can use the provided `*.workers.dev` address first.

## Deploy

Run these commands inside this folder:

1. `npm install`
2. `npx wrangler login` and choose your own Cloudflare account.
3. `npx wrangler d1 create interviewprep-ai-db`. Copy the returned `database_id` into `wrangler.jsonc`, replacing `00000000-0000-4000-8000-000000000000`.
4. `npx wrangler d1 migrations apply DB --remote` to create the tables in your new D1 database.
5. `npm run build`
6. `npm run deploy`. Wrangler reports a `*.workers.dev` URL.
7. `npx wrangler secret put ANTHROPIC_API_KEY` and paste the key into Wrangler's hidden prompt. This deploys a new Worker version with the secret. Do not put the key in `wrangler.jsonc` or Git.

Test the `*.workers.dev` address by opening a built-in topic (BFS) and generating a new one. The built-in topics should work without an Anthropic call.

## Connect your domain

In the Cloudflare dashboard, open **Workers & Pages → interviewprep-ai → Settings → Domains & Routes → Add → Custom Domain**. Enter a hostname such as `prep.yourdomain.com` (or the root domain if you prefer), then confirm. The domain must be in an active Cloudflare zone you control.

## Local development

Put `ANTHROPIC_API_KEY=...` in an ignored `.dev.vars` file for local Worker development. Do not copy your secret into the distributed ZIP. After replacing the database ID, run `npx wrangler d1 migrations apply DB --local` and `npm run dev`. The D1 local and remote databases are separate.

## Notes

- This deploy starts with a **new database**. Lessons and quiz attempts in the ChatGPT Sites database are not automatically transferred.
- Quiz history uses an anonymous browser cookie, so moving to a new domain creates a new visitor identity. There is no account sync.
- Generated lessons can incur Anthropic charges. Before opening the site to the public, set an Anthropic spending limit and add a request limit or sign-in to the generation route.
- The supplied `wrangler.jsonc` has a placeholder database ID. Replace it with the ID from **your** Cloudflare account before deploying.
