import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAi } from "@/lib/ai.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiOutput, Disclaimer } from "@/components/AiOutput";
import { HistoryPanel } from "@/components/HistoryPanel";
import { FileDrop } from "@/components/FileDrop";
import { Search, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — WorkAI" }] }),
  component: Page,
});

function Page() {
  const run = useServerFn(runAi);
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const research = useCallback(async () => {
    if (!topic.trim()) { toast.error("Enter a topic to research."); return; }
    setLoading(true); setOutput("");
    const prompt = `Topic: ${topic}\nAngle / focus: ${angle || "(general overview)"}`;
    const res = await run({ data: { feature: "research", messages: [{ role: "user", content: prompt }], title: topic } });
    if (res.ok) { setOutput(res.content); setRefresh((r) => r + 1); }
    else toast.error(res.error);
    setLoading(false);
  }, [run, topic, angle]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Research Assistant</h1>
          <p className="text-sm text-muted-foreground">Get a structured briefing on any topic in seconds.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Topic</CardTitle>
              <CardDescription>What do you want a briefing on? ⌘/Ctrl+Enter to run.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") research(); }}>
              <div className="space-y-1.5">
                <Label>Topic</Label>
                <Input value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder="e.g. EU AI Act impact on SaaS startups" />
              </div>
              <div className="space-y-1.5">
                <Label>Focus / angle (optional)</Label>
                <Textarea rows={4} value={angle} onChange={(e)=>setAngle(e.target.value)} placeholder="Compliance timelines, what to prioritize first…" />
              </div>
              <FileDrop onText={(t) => setAngle(t)} />
              <Button onClick={research} disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
                <Wand2 className="mr-2 h-4 w-4" />
                {loading ? "Researching…" : "Generate briefing"}
              </Button>
            </CardContent>
          </Card>
          <HistoryPanel feature="research" refreshKey={refresh} onLoad={(it) => { setTopic(it.title || ""); setOutput(it.output); }} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Briefing</CardTitle>
            <CardDescription>Insights, context, risks, next steps.</CardDescription>
          </CardHeader>
          <CardContent>
            <AiOutput content={output} loading={loading} onRegenerate={research} filename="research-brief.md" />
            <Disclaimer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
