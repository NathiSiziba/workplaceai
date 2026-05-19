
# O.S.I.R.A. — Phase 1 Plan

Transform the current WorkAI productivity app into the **O.S.I.R.A.** brand and information architecture. This phase ships the look, the nav, and stubbed surfaces for every promised feature so the product story is legible end-to-end. No new backend, no new integrations — those come in later phases.

## Phase 1 scope (this build)

1. **Brand & theme overhaul**
   - Rename throughout: WorkAI → O.S.I.R.A.
   - New token palette in `src/styles.css`: deep black background, emerald green primary, cyan accent, glassmorphism surface tokens (translucent panels, blurred backdrops, subtle gradient borders).
   - Update `AppSidebar` logo (emerald square → ankh / lightning glyph + "O.S.I.R.A." wordmark).
   - Marquee banner restyled in new palette with Afro-futurist tagline.

2. **New navigation (replaces current sidebar items)**
   - Command Center (dashboard)
   - AI Employees (HR / Ops / Finance / Sales tabs)
   - Knowledge Vault
   - Workflow Studio
   - Analytics
   - Voice Assistant
   - Logistics Hub
   - Settings → Compliance (POPIA) & Integrations (WhatsApp, PayFast)

3. **Stubbed surfaces** — each new route renders a real, branded page with empty-state UI and a clear "Coming in next phase" tag. No fake data passed off as real:
   - `/` Command Center — KPI cards (fleet, agents on duty, alerts), recent activity feed, agent status grid.
   - `/agents` — 4 agent cards (HR, Ops, Finance, Sales) with persona, capabilities, "Activate" CTA (disabled).
   - `/vault` — upload dropzone (visual only), document list empty state, semantic search bar (disabled).
   - `/studio` — canvas placeholder with trigger/action node legend.
   - `/analytics` — chart skeletons with placeholder copy.
   - `/voice` — large mic button + waveform mock.
   - `/logistics` — fleet table skeleton, route map placeholder, driver check-in list.
   - `/settings/compliance` — POPIA checklist (consent, data residency, audit log, DSAR) as static status items.
   - `/settings/integrations` — WhatsApp & PayFast cards with "Connect" buttons that open a "credentials required" modal.

4. **Keep working**: existing `runAi` server fn, auth, login. The old `/email`, `/meetings`, `/tasks`, `/research`, `/chat` routes get folded under the **Sales / Ops / HR agent personas** (same underlying serverFn, just rebranded surfaces) so nothing regresses.

## Out of scope (later phases)

- Phase 2: Real multi-agent personas with distinct system prompts + agent-to-agent handoff
- Phase 3: Knowledge Vault — Supabase storage bucket, pgvector embeddings, RAG search
- Phase 4: Workflow Studio — trigger/action graph + execution engine
- Phase 5: Voice — ElevenLabs Conversational AI
- Phase 6: WhatsApp (Meta Cloud API) + PayFast checkout & ITN webhook
- Phase 7: Predictive analytics (real data + forecasting model)

## Technical notes

- All new colors as `oklch` design tokens in `src/styles.css`. Glass surfaces via `backdrop-blur` + semi-transparent token (`--surface-glass`).
- New routes are plain `createFileRoute` files under `src/routes/`, all gated by existing `AuthGate`.
- No DB migrations, no new server functions, no new secrets.
- Old routes (`/email`, `/chat`, etc.) kept but linked from agent detail pages rather than top-level nav.

## Deliverable

A coherent, demo-ready O.S.I.R.A. shell where every promised capability has a real page — clearly marked as either functional (auth, chat, email gen) or "Phase N" preview. Ready for stakeholder walkthrough.
