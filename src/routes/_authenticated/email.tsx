import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAi } from "@/lib/ai.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiOutput, Disclaimer } from "@/components/AiOutput";
import { HistoryPanel } from "@/components/HistoryPanel";
import { Mail, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — WorkAI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(runAi);
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("client");
  const [subject, setSubject] = useState("");
  const [intent, setIntent] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const generate = useCallback(async () => {
    if (!intent.trim()) { toast.error("Tell me what the email is about."); return; }
    setLoading(true);
    setOutput("");
    const prompt = `Tone: ${tone}\nAudience: ${audience}\nSubject hint: ${subject || "(let AI propose one)"}\n\nWrite an email about:\n${intent}`;
    const res = await run({ data: { feature: "email", messages: [{ role: "user", content: prompt }], title: subject || intent.slice(0, 60) } });
    if (res.ok) { setOutput(res.content); setRefresh((r) => r + 1); }
    else toast.error(res.error);
    setLoading(false);
  }, [run, tone, audience, subject, intent]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader icon={Mail} title="Smart Email Generator" desc="Generate professional emails tailored by tone and audience." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brief</CardTitle>
              <CardDescription>Describe what you want to say. ⌘/Ctrl+Enter to generate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") generate(); }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["professional","friendly","formal","persuasive","apologetic","assertive","concise"].map(t=>(
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Audience</Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["client","manager","team","executive","vendor","candidate","customer"].map(t=>(
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Subject hint (optional)</Label>
                <Input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="e.g. Project update – Q3 launch" />
              </div>
              <div className="space-y-1.5">
                <Label>What is the email about?</Label>
                <Textarea
                  rows={7}
                  value={intent}
                  onChange={(e)=>setIntent(e.target.value)}
                  placeholder="Follow up on our pricing discussion, propose a 30-min call next week…"
                />
              </div>
              <Button onClick={generate} disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
                <Wand2 className="mr-2 h-4 w-4" />
                {loading ? "Generating…" : "Generate email"}
              </Button>
            </CardContent>
          </Card>
          <HistoryPanel
            feature="email"
            refreshKey={refresh}
            onLoad={(it) => { setIntent(it.input.split("Write an email about:\n").pop() || it.input); setOutput(it.output); }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Draft</CardTitle>
            <CardDescription>Review and copy when ready.</CardDescription>
          </CardHeader>
          <CardContent>
            <AiOutput content={output} loading={loading} onRegenerate={generate} filename="email.md" />
            <Disclaimer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PageHeader({ icon: Icon, title, desc }: { icon: React.ComponentType<{className?:string}>; title: string; desc: string }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
