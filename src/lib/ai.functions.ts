import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Feature = "email" | "meeting" | "task" | "research" | "chat";

const SYSTEM_PROMPTS: Record<Feature, string> = {
  email: `You are an expert business communication assistant. Generate a professional email based on the user's request.

Follow this structure strictly:
- Subject: <concise subject line>
- Greeting appropriate to audience
- Body: 2-4 short paragraphs, clear and on-message
- Closing + sign-off placeholder ([Your Name])

Match the requested TONE precisely (formal, friendly, persuasive, apologetic, assertive, etc.) and tailor vocabulary to the AUDIENCE. Be concise. No filler. Output only the email — no commentary.`,

  meeting: `You are a meeting analyst. Given raw meeting notes or a transcript, produce a structured summary in markdown:

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

Be faithful to the source. Do not invent details.`,

  task: `You are an AI productivity coach. Given a list of tasks (and optional context like deadlines, energy, or workday hours), produce a prioritized, scheduled plan in markdown.

## Prioritized Plan
For each task output:
**1. <Task title>** — Priority: High|Medium|Low · Est: <minutes> · Suggested slot: <Morning/Afternoon/Tomorrow AM/etc.>
> Rationale: one short sentence using Eisenhower (urgent/important) reasoning.

## Today's Focus Block
A 2-3 hour deep-work suggestion identifying the single most leveraged task.

## Quick Wins
Tasks under 15 minutes that can be batched.

Be realistic. Don't overload the day.`,

  research: `You are a senior research analyst. For the topic the user provides, produce a structured briefing in markdown:

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

Be precise. If you are uncertain about a fact, mark it clearly with "(needs verification)". Never fabricate citations.`,

  chat: `You are a friendly, sharp workplace productivity assistant. Help the user think through work problems, draft messages, plan, summarize, and decide. Be concise by default — expand only when asked. Use markdown formatting (lists, bold, code) when it improves clarity. If a request is ambiguous, ask one clarifying question before answering.`,
};

const MODEL = "google/gemini-3-flash-preview";

const InputSchema = z.object({
  feature: z.enum(["email", "meeting", "task", "research", "chat"]),
  messages: z.array(z.object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.string().min(1).max(50000),
  })).min(1).max(50),
  title: z.string().max(200).optional(),
  persist: z.boolean().optional(),
});

export const runAi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: z.infer<typeof InputSchema>) => InputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ok: false as const, error: "LOVABLE_API_KEY not configured" };

    const system = SYSTEM_PROMPTS[data.feature];

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: system }, ...data.messages],
        }),
      });

      if (res.status === 429) return { ok: false as const, error: "Rate limit reached. Please wait a moment and try again." };
      if (res.status === 402) return { ok: false as const, error: "AI credits exhausted. Add credits in Workspace → Usage." };
      if (!res.ok) {
        console.error("AI gateway error", res.status, await res.text());
        return { ok: false as const, error: `AI service error (${res.status})` };
      }

      const json = await res.json();
      const content: string = json?.choices?.[0]?.message?.content ?? "";

      // Persist generation (best effort) for non-chat features
      if (data.persist !== false && data.feature !== "chat" && content) {
        const userInput = data.messages.map((m) => m.content).join("\n\n");
        await context.supabase
          .from("generations")
          .insert({
            user_id: context.userId,
            feature: data.feature,
            title: data.title ?? userInput.slice(0, 80),
            input: userInput.slice(0, 50000),
            output: content.slice(0, 200000),
            model: MODEL,
          });
      }

      return { ok: true as const, content };
    } catch (e) {
      console.error("runAi failed", e);
      return { ok: false as const, error: "AI request failed. Please try again." };
    }
  });
