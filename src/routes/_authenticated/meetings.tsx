import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAi } from "@/lib/ai.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiOutput, Disclaimer } from "@/components/AiOutput";
import { HistoryPanel } from "@/components/HistoryPanel";
import { FileDrop } from "@/components/FileDrop";
import { FileText, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — WorkAI" }] }),
  component: Page,
});

function Page() {
  const run = useServerFn(runAi);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const summarize = useCallback(async () => {
    if (notes.trim().length < 30) { toast.error("Paste at least a few sentences of notes."); return; }
    setLoading(true); setOutput("");
    const res = await run({ data: { feature: "meeting", messages: [{ role: "user", content: notes }], title: notes.slice(0, 60) } });
    if (res.ok) { setOutput(res.content); setRefresh((r) => r + 1); }
    else toast.error(res.error);
    setLoading(false);
  }, [run, notes]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Meeting Notes Summarizer</h1>
          <p className="text-sm text-muted-foreground">Extract key points, decisions, action items, and deadlines.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Raw notes or transcript</CardTitle>
              <CardDescription>Paste, drop a file, or type. ⌘/Ctrl+Enter to summarize.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") summarize(); }}>
              <FileDrop onText={(t) => setNotes(t)} />
              <Textarea rows={14} value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Paste meeting notes here…" />
              <Button onClick={summarize} disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
                <Wand2 className="mr-2 h-4 w-4" />
                {loading ? "Summarizing…" : "Summarize meeting"}
              </Button>
            </CardContent>
          </Card>
          <HistoryPanel feature="meeting" refreshKey={refresh} onLoad={(it) => { setNotes(it.input); setOutput(it.output); }} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Structured summary</CardTitle>
            <CardDescription>Key points, decisions, actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <AiOutput content={output} loading={loading} onRegenerate={summarize} filename="meeting-summary.md" />
            <Disclaimer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
