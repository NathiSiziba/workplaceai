# WorkAI Medium Upgrade Plan

A focused round of 5 improvements that touch all four areas you picked: persistence & auth, smarter AI, polish, and a useful integration. Each is scoped to ship together cleanly without rearchitecting the app.

---

## 1. Auth + per-user history (persistence & auth)

Add Google sign-in + email/password via Lovable Cloud, then save every AI generation to the database so nothing is lost on refresh.

- New `/login` route with Google button + email/password form
- `_authenticated` layout route guarding `/email`, `/meetings`, `/tasks`, `/research`, `/chat`
- Header avatar with sign-out
- New tables (all RLS-scoped to `auth.uid()`):
  - `generations` — feature, prompt/input, output, model, created_at
  - `chat_conversations` + `chat_messages` — multi-turn chat with titles
- On each AI feature page: a collapsible "History" panel listing past runs, click to reload

## 2. Streaming responses + copy/regenerate/export (smarter AI)

Replace the "spin then dump" UX with live streaming and proper output controls.

- Switch `runAi` to a streaming server function (SSE) so tokens appear as they generate
- `<AiOutput />` gets a toolbar: Copy, Regenerate, Download (.md), and (for emails) Copy as plain text
- Chat becomes a real conversation: messages persist, "New chat" button, conversation sidebar

## 3. File upload for Meetings + Research (smarter AI)

Let users drop a `.txt`, `.md`, or `.pdf` instead of pasting raw notes.

- File input on Meetings (transcript) and Research (source doc)
- PDF parsed in the browser with `pdfjs-dist`; text sent to the existing prompt
- Size cap (e.g. 2 MB) with a friendly error

## 4. UX & design polish

Tighten the visual layer without redesigning.

- Skeleton loaders instead of generic spinners
- Empty states with example prompts ("Try: Follow-up email to a client who missed a deadline")
- Better mobile layout: sidebar collapses to a sheet, forms stack cleanly < 640px
- Subtle motion: fade/slide for AI output, hover lift on dashboard cards
- Keyboard: ⌘/Ctrl+Enter submits any AI form

## 5. Global command palette (new integration-style feature)

A ⌘K palette that jumps between tools, opens recent generations, and starts a new chat — a small piece that makes the app feel like a real product.

- Built on the existing `cmdk` component
- Searches: routes, recent generations (from the new `generations` table), quick actions

---

## Technical Details

**Files added**
- `src/routes/login.tsx`, `src/routes/_authenticated.tsx`
- `src/components/HistoryPanel.tsx`, `src/components/CommandPalette.tsx`, `src/components/FileDrop.tsx`, `src/components/UserMenu.tsx`
- `src/lib/generations.functions.ts`, `src/lib/chat.functions.ts`
- `src/hooks/use-auth.ts`

**Files changed**
- `src/lib/ai.functions.ts` — streaming variant, persist on completion
- `src/components/AiOutput.tsx` — toolbar + skeleton + streaming render
- All 5 feature routes — load history, save on generate, keyboard shortcut
- `src/routes/__root.tsx` — mount `<CommandPalette />`, auth listener, user menu
- `src/components/AppSidebar.tsx` — user block at footer

**Database (one migration)**
- `generations` table + RLS (user owns rows)
- `chat_conversations` + `chat_messages` + RLS
- `profiles` table + auto-create trigger on signup (display name, avatar)

**Auth**
- Email/password + Google via Lovable Cloud (`lovable.auth.signInWithOAuth`)
- `configure_social_auth` with `providers: ["google"]`
- `attachSupabaseAuth` already wired in `src/start.ts`

**Out of scope this round**
- Calendar / Slack / Gmail integrations (separate larger round)
- Streaming for ALL providers (we'll use Gemini's stream endpoint only)
- Team workspaces / sharing

---

Ready to build? Approve and I'll start with the auth + database migration, then layer in streaming, file upload, polish, and the command palette.