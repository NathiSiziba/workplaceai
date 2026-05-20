import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listGenerations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { feature: string; limit?: number }) =>
    z.object({ feature: z.string().min(1).max(50), limit: z.number().min(1).max(50).optional() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: rows, error } = await supabase
      .from("generations")
      .select("id, feature, title, input, output, model, created_at")
      .eq("feature", data.feature)
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 20);
    if (error) return { ok: false as const, error: error.message, items: [] };
    return { ok: true as const, items: rows ?? [] };
  });

export const saveGeneration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { feature: string; title?: string; input: string; output: string; model?: string }) =>
    z.object({
      feature: z.string().min(1).max(50),
      title: z.string().max(200).optional(),
      input: z.string().min(1).max(50000),
      output: z.string().min(1).max(200000),
      model: z.string().max(100).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("generations")
      .insert({ user_id: userId, feature: data.feature, title: data.title ?? null, input: data.input, output: data.output, model: data.model ?? null })
      .select("id, created_at")
      .single();
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, id: row.id, created_at: row.created_at };
  });

export const deleteGeneration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("generations").delete().eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const recentAllGenerations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("generations")
      .select("id, feature, title, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) return { ok: false as const, items: [] as Array<{ id: string; feature: string; title: string | null; created_at: string }> };
    return { ok: true as const, items: data ?? [] };
  });
