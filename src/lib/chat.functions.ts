import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listConversations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_conversations")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) return { ok: false as const, items: [], error: error.message };
    return { ok: true as const, items: data ?? [] };
  });

export const createConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { title?: string }) =>
    z.object({ title: z.string().max(200).optional() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("chat_conversations")
      .insert({ user_id: context.userId, title: data.title ?? "New chat" })
      .select("id, title, updated_at")
      .single();
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, conversation: row };
  });

export const getConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: messages, error } = await context.supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", data.id)
      .order("created_at", { ascending: true });
    if (error) return { ok: false as const, messages: [], error: error.message };
    return { ok: true as const, messages: messages ?? [] };
  });

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { conversationId: string; content: string }) =>
    z.object({
      conversationId: z.string().uuid(),
      content: z.string().min(1).max(20000),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // 1. insert user message
    const { error: insertErr } = await supabase.from("chat_messages").insert({
      conversation_id: data.conversationId,
      user_id: userId,
      role: "user",
      content: data.content,
    });
    if (insertErr) return { ok: false as const, error: insertErr.message };

    // 2. load full history
    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: true });

    // 3. call AI
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ok: false as const, error: "LOVABLE_API_KEY not configured" };

    const messages = [
      {
        role: "system",
        content:
          "You are a friendly, sharp workplace productivity assistant. Help the user think through work problems, draft messages, plan, summarize, and decide. Be concise by default — expand only when asked. Use markdown formatting when it improves clarity. If a request is ambiguous, ask one clarifying question.",
      },
      ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages }),
    });
    if (res.status === 429) return { ok: false as const, error: "Rate limit reached. Try again in a moment." };
    if (res.status === 402) return { ok: false as const, error: "AI credits exhausted." };
    if (!res.ok) return { ok: false as const, error: `AI service error (${res.status})` };
    const json = await res.json();
    const assistant: string = json?.choices?.[0]?.message?.content ?? "";

    // 4. persist assistant message
    await supabase.from("chat_messages").insert({
      conversation_id: data.conversationId,
      user_id: userId,
      role: "assistant",
      content: assistant,
    });

    // 5. touch conversation + auto-title if new
    const isFirst = (history ?? []).length <= 1;
    const title = isFirst ? data.content.slice(0, 60) : undefined;
    await supabase
      .from("chat_conversations")
      .update({ updated_at: new Date().toISOString(), ...(title ? { title } : {}) })
      .eq("id", data.conversationId);

    return { ok: true as const, assistant };
  });

export const deleteConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("chat_conversations").delete().eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
