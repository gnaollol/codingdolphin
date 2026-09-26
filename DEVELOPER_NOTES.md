# Coding Dolphin AI — Developer Notes

Updated: 2026-09-25

Keep this file in the project root, beside `package.json`. Update it when routes, database tables, environment variables, or deployment steps change.

## What the app does

The landing page at `/` greets the signed-in user and links to `/study`. Users can generate and review technical interview study modules, take the module quiz, save topics, make their own flashcards from saved topics, and take a self-graded flashcard recall quiz. Previously generated modules are cached in D1. Auth uses Better Auth with email/password and Google sign-in.

## Stack and key files

| Area | Location | Purpose |
| --- | --- | --- |
| App pages | `app/` | Next-compatible React/TypeScript routes built with Vinext |
| Styles | `app/globals.css` | Shared and page-specific CSS |
| Auth server | `lib/auth.ts` | Better Auth configuration and D1 Drizzle adapter |
| Auth client | `lib/auth-client.ts` | Browser-side session and sign-in methods |
| Main schema | `db/schema.ts` | Modules, quiz attempts, history, saved topics, flashcards |
| Auth schema | `db/auth-schema.ts` | Better Auth user, session, account, verification tables |
| D1 access | `db/index.ts` | `getDb()` |
| Migrations | `drizzle/` | Generated SQL, tracked by Wrangler |
| Worker config | `wrangler.jsonc` | Worker name, compatibility settings, D1 binding `DB` |
| Local secrets | `.dev.vars` | Local-only secrets; never commit or share |

### Page routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/study` | Generate and review study modules |
| `/login` | Email/password and Google sign-in |
| `/profile` | User details and links to history/saved topics |
| `/settings` | Display name and Google account connection |
| `/history` | Previously asked questions |
| `/saved` | Saved topics, with links to their flashcards |
| `/flashcards?moduleId=...` | Create, edit, delete, and review cards for one saved module |
| `/flashcards/quiz?moduleId=...` | Self-graded recall quiz using those cards |

### API routes

| Route | Methods | Purpose |
| --- | --- | --- |
| `/api/auth/[...all]` | GET, POST | Better Auth handler |
| `/api/modules` | GET, POST | Topic search and module generation/cache |
| `/api/modules/[id]` | GET | Load a module by ID |
| `/api/attempts` | GET, POST | Module quiz progress |
| `/api/history` | GET | Signed-in user's question history |
| `/api/saved` | GET, POST, DELETE | Signed-in user's saved modules |
| `/api/flashcards` | GET, POST | List/create cards for one saved module |
| `/api/flashcards/[id]` | PUT, DELETE | Edit/delete a card owned by the signed-in user |
| `/api/flashcard-quiz` | GET, POST | Recent scores and new self-graded quiz result |

Do not place a `page.tsx` and `route.ts` at the same URL. For example, the flashcard screen is `app/flashcards/page.tsx`, while its API is `app/api/flashcards/route.ts`.

## Database guide

D1 is SQLite. The local development database and the deployed remote database are separate. Wrangler's `DB` binding points the Worker at the configured D1 database.

| Table | Data |
| --- | --- |
| `user` | User ID, display name, email, verification status, timestamps |
| `session` | Active session records and tokens; treat as sensitive |
| `account` | Login methods linked to a user, including Google provider details; credential rows hold **password hashes**, not readable passwords |
| `verification` | Temporary auth verification records |
| `modules` | Cached generated study content and options |
| `attempts` | Module quiz scores |
| `question_history` | Modules each user asked about |
| `saved_modules` | Modules each user saved |
| `flashcards` | User-created question/answer cards tied to a module |
| `flashcard_quiz_attempts` | Self-graded flashcard quiz scores over time |

### See the live data

In the Cloudflare dashboard, open **D1 SQL Database**, select the database named in `wrangler.jsonc` (for example, `interviewprep-ai-db`), then open **Tables**. Choose `user` to inspect names/emails, `saved_modules` or `flashcards` for study data, and `flashcard_quiz_attempts` for scores. The **Console** can run a read-only query such as:

```sql
SELECT id, name, email FROM "user" ORDER BY email LIMIT 50;
```

The `account.password` value, when present, is a one-way password hash. A Google-only account may have no password hash. Never display or export session tokens, OAuth tokens, hashes, or user emails publicly. Use the auth library's password-change/reset flows instead of trying to recover a password from the database.

## Local development

Run these commands in the folder containing `package.json` and `wrangler.jsonc`:

```powershell
npm install
npm run db:migrate:local
npm run dev
```

Other checks:

```powershell
npm run typecheck
npm run build
```

`.dev.vars` contains local values such as `ANTHROPIC_API_KEY`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`. Production values belong in the Worker's Cloudflare **Settings → Variables and Secrets**. `BETTER_AUTH_URL` must be the actual production origin for the deployed Worker.

## Changing the schema and deploying

1. Edit `db/schema.ts` (or the auth schema when appropriate).
2. Run `npm run db:generate`; inspect the new file in `drizzle/`.
3. Run `npm run db:migrate:local`, `npm run typecheck`, and `npm run build`.
4. Before a production migration, export the remote database to a local `.sql` file:

   ```powershell
   npx wrangler d1 export interviewprep-ai-db --remote --output=./interviewprep-before-change.sql
   ```

   Use the real `database_name` from `wrangler.jsonc` if it differs. Keep backup files out of Git.

5. Run `npm run db:migrate:remote` and review the pending migration names before confirming.
6. Run `npm run build` and `npm run deploy`.
7. Test the live landing page, login, module generation/loading, Saved → Flashcards, and a quiz score after refresh.

Migration `0004_fine_red_hulk.sql` adds `flashcards` and `flashcard_quiz_attempts`. Production migration `0004` was applied before the flashcard release.

## Security and maintenance reminders

- Authenticated API routes should derive `userId` from the server-side session, never trust a user ID sent by the browser.
- Flashcard reads and writes must filter by `userId`; creation also checks the module is in that user's saved list.
- Keep `.dev.vars`, database exports, API keys, auth secrets, and OAuth client secrets out of source control.
- D1 backups made with `wrangler d1 export` are local SQL files. Store them securely because they contain user data.
- The current flashcard quiz asks the user to compare their typed response with the saved answer and mark it right or wrong; its score is therefore self-reported.
- If Google OAuth remains in Testing mode in Google Cloud, only configured test users can use it. Review that configuration before inviting the public.
- Email verification and password reset need a configured email delivery flow before those account features can be offered.

## References

- Cloudflare D1 dashboard and Console: https://developers.cloudflare.com/d1/get-started/
- Cloudflare D1 export: https://developers.cloudflare.com/d1/best-practices/import-export-data/
- Better Auth schema: https://better-auth.com/docs/concepts/database
- Better Auth user and account methods: https://better-auth.com/docs/concepts/users-accounts
