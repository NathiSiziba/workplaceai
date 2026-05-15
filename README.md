How This App Was Built
Tech Stack
Layer	Technology
Framework	TanStack Start v1 (full-stack React 19 with SSR)
Build Tool	Vite 7
Runtime	Cloudflare Workers (edge)
Styling	Tailwind CSS v4 with custom design tokens in src/styles.css
UI Components	shadcn/ui (Button, Card, Input, Textarea, Badge, Sidebar, etc.)
Icons	Lucide React
AI Backend	Lovable AI Gateway (ai.gateway.lovable.dev) — no API key required
Notifications	Sonner toast system
Architecture
src/
├── routes/                 # File-based routing (TanStack Router)
│   ├── __root.tsx          # Root layout (sidebar + marquee + header)
│   ├── index.tsx           # Dashboard / homepage
│   ├── email.tsx           # Smart Email Generator
│   ├── meetings.tsx        # Meeting Notes Summarizer
│   ├── tasks.tsx           # AI Task Planner
│   ├── research.tsx        # AI Research Assistant
│   └── chat.tsx            # AI Chatbot Interface
├── components/
│   ├── AppSidebar.tsx      # Sidebar navigation with logo
│   ├── AiOutput.tsx        # Markdown rendering + loading state
│   └── ui/                 # shadcn/ui component library
├── lib/
│   ├── ai.functions.ts     # Server functions calling AI gateway
│   └── utils.ts            # Tailwind cn() helper
├── integrations/supabase/  # Auto-generated auth & DB clients
└── styles.css              # Design tokens (forest green theme)
Design System
The app uses a premium SaaS aesthetic with a forest green + black + white palette:

Primary: #2D6A4F (forest green) — buttons, accents, focus rings
Background: #0D0D0D (near-black) — sidebar, dark sections
Surface: #FFFFFF (white) — cards, content areas
Text: #0D0D0D headings, #333333 body, white on dark backgrounds
Gradients: Forest green gradient for stat cards
Shadows: Soft black shadows on white cards
The AI Prompts
Each feature uses a carefully engineered system prompt in src/lib/ai.functions.ts:

1. Smart Email Generator (email)
You are an expert business communication assistant. Generate a professional email based on the user's request.

Follow this structure strictly:
- Subject: <concise subject line>
- Greeting appropriate to audience
- Body: 2-4 short paragraphs, clear and on-message
- Closing + sign-off placeholder ([Your Name])

Match the requested TONE precisely (formal, friendly, persuasive, apologetic, assertive, etc.) and tailor vocabulary to the AUDIENCE. Be concise. No filler. Output only the email — no commentary.
2. Meeting Notes Summarizer (meeting)
You are a meeting analyst. Given raw meeting notes or a transcript, produce a structured summary in markdown:

## Summary
2-3 sentence overview.

## Key Points
- bullet list of the most important discussion points

## Decisions
- explicit decisions made (or "None recorded")

## Action Items
| Owner | Task | Deadline |
|-------|------|----------|
(infer owners from context; use "Unassigned" if unclear; use "TBD" if no deadline)

## Open Questions
- unresolved items needing follow-up

Be faithful to the source. Do not invent details.
3. AI Task Planner (task)
You are an AI productivity coach. Given a list of tasks (and optional context like deadlines, energy, or workday hours), produce a prioritized, scheduled plan in markdown.

## Prioritized Plan
For each task output:
**1. <Task title>** — Priority: High|Medium|Low · Est: <minutes> · Suggested slot: <Morning/Afternoon/Tomorrow AM/etc.>
> Rationale: one short sentence using Eisenhower (urgent/important) reasoning.

## Today's Focus Block
A 2-3 hour deep-work suggestion identifying the single most leveraged task.

## Quick Wins
Tasks under 15 minutes that can be batched.

Be realistic. Don't overload the day.
4. AI Research Assistant (research)
You are a senior research analyst. For the topic the user provides, produce a structured briefing in markdown:

## Executive Summary
3-4 sentences capturing the essence.

## Key Insights
- 4-6 bullets, each a non-obvious insight (not a definition)

## Background & Context
A short paragraph framing the topic.

## Considerations & Risks
- balanced view including counterpoints

## Suggested Next Steps
- 3 concrete follow-up actions or sub-questions

Be precise. If you are uncertain about a fact, mark it clearly with "(needs verification)". Never fabricate citations.
5. AI Chatbot (chat)
You are a friendly, sharp workplace productivity assistant. Help the user think through work problems, draft messages, plan, summarize, and decide. Be concise by default — expand only when asked. Use markdown formatting (lists, bold, code) when it improves clarity. If a request is ambiguous, ask one clarifying question before answering.
How AI Calls Work
All features use the same server function pattern (createServerFn from TanStack Start):

User fills a form → component calls useServerFn(runAi)
Server receives the request → selects the system prompt by feature key
Server POSTs to https://ai.gateway.lovable.dev/v1/chat/completions with the system prompt + user message
AI responds → server returns the content back to the component
Component renders the markdown output via the <AiOutput /> component
The model used is google/gemini-3-flash-preview by default — fast, capable, and included with Lovable AI Gateway (no external API key needed).
