import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAi } from "@/lib/ai.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiOutput, Disclaimer } from "@/components/AiOutput";
import { ListTodo, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — Workplace AI" }] }),
  component: Page,
});

function Page() {
  const run = useServerFn(runAi);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("8");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function plan() {
    if (!tasks.trim()) {
      toast.error("Add at least one task.");
      return;
    }
    setLoading(true);
    setOutput("");
    const prompt = `Available hours today: ${hours}\nContext: ${context || "(none)"}\n\nTasks (one per line):\n${tasks}`;
    const res = await run({ data: { feature: "task", messages: [{ role: "user", content: prompt }] } });
    if (res.ok) setOutput(res.content);
    else toast.error(res.error);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant">
          <ListTodo className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Task Planner</h1>
          <p className="text-sm text-muted-foreground">Prioritize and schedule your day intelligently.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
            <CardDescription>One task per line. Add deadlines if known.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Hours available</Label>
                <Input type="number" min={1} max={16} value={hours} onChange={(e)=>setHours(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Context (optional)</Label>
                <Input value={context} onChange={(e)=>setContext(e.target.value)} placeholder="e.g. low energy, 2pm meeting" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tasks</Label>
              <Textarea
                rows={10}
                value={tasks}
                onChange={(e)=>setTasks(e.target.value)}
                placeholder={`Finish Q3 report — due tomorrow\nReview pull requests\nCall supplier\nPrep board deck`}
              />
            </div>
            <Button onClick={plan} disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
              <Wand2 className="mr-2 h-4 w-4" />
              {loading ? "Planning…" : "Plan my day"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prioritized plan</CardTitle>
            <CardDescription>Schedule, focus block, and quick wins.</CardDescription>
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
