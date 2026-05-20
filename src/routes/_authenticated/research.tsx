import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAi } from "@/lib/ai.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiOutput, Disclaimer } from "@/components/AiOutput";
import { Search, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — Workplace AI" }] }),
  component: Page,
});

function Page() {
  const run = useServerFn(runAi);
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function research() {
    if (!topic.trim()) {
      toast.error("Enter a topic to research.");
      return;
    }
    setLoading(true);
    setOutput("");
    const prompt = `Topic: ${topic}\nAngle / focus: ${angle || "(general overview)"}`;
    const res = await run({ data: { feature: "research", messages: [{ role: "user", content: prompt }] } });
    if (res.ok) setOutput(res.content);
    else toast.error(res.error);
    setLoading(false);
  }

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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topic</CardTitle>
            <CardDescription>What do you want a briefing on?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Topic</Label>
              <Input value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder="e.g. EU AI Act impact on SaaS startups" />
            </div>
            <div className="space-y-1.5">
              <Label>Focus / angle (optional)</Label>
              <Textarea rows={5} value={angle} onChange={(e)=>setAngle(e.target.value)} placeholder="Compliance timelines, what to prioritize first…" />
            </div>
            <Button onClick={research} disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
              <Wand2 className="mr-2 h-4 w-4" />
              {loading ? "Researching…" : "Generate briefing"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Briefing</CardTitle>
            <CardDescription>Insights, context, risks, next steps.</CardDescription>
          </CardHeader>
          <CardContent>
            <AiOutput content={output} loading={loading} />
            <Disclaimer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
