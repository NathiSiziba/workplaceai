import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAi } from "@/lib/ai.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — Workplace AI" }] }),
  component: Page,
});

type Msg = { role: "user" | "assistant"; content: string };

function Page() {
  const run = useServerFn(runAi);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const res = await run({ data: { feature: "chat", messages: next } });
    if (res.ok) {
      setMessages([...next, { role: "assistant", content: res.content }]);
    } else {
      toast.error(res.error);
      setMessages(next);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col px-6 py-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Chatbot</h1>
          <p className="text-sm text-muted-foreground">Your workplace thinking partner.</p>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant">
                <Sparkles className="h-5 w-5" />
              </div>
              Ask anything — drafting, planning, summarizing, deciding.
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-card",
                  m.role === "user"
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-4 py-3 text-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.1s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-card p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message your assistant…"
              rows={1}
              className="min-h-[44px] resize-none"
            />
            <Button onClick={send} disabled={loading || !input.trim()} className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            AI-generated content may require human review.
          </div>
        </div>
      </Card>
    </div>
  );
}
