import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workflow, Zap, GitBranch, Webhook, Bot, Database, Plus } from "lucide-react";

export const Route = createFileRoute("/studio")({
  head: () => ({ meta: [{ title: "Workflow Studio — O.S.I.R.A." }] }),
  component: Studio,
});

const triggers = [
  { icon: Webhook, name: "Webhook" },
  { icon: Zap, name: "Schedule" },
  { icon: Database, name: "DB change" },
];
const actions = [
  { icon: Bot, name: "Run AI agent" },
  { icon: GitBranch, name: "Branch logic" },
  { icon: Workflow, name: "Send WhatsApp" },
];

function Studio() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        eyebrow="Automation"
        title="Workflow Studio"
        description="Drag triggers and actions onto the canvas to automate recurring work. Wire AI employees into business processes without writing code."
        phase="Phase 4 · Preview"
        actions={<Button disabled className="bg-gradient-primary text-primary-foreground"><Plus className="mr-1 h-4 w-4" />New workflow</Button>}
      />

      <div className="grid gap-5 lg:grid-cols-[200px_1fr_200px]">
        <Card className="glass p-4">
          <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Triggers</div>
          <div className="space-y-2">
            {triggers.map((t) => (
              <div key={t.name} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2.5 text-sm">
                <t.icon className="h-4 w-4 text-accent" /> {t.name}
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass relative flex min-h-[420px] items-center justify-center overflow-hidden p-6">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle, oklch(0.78 0.13 200 / 0.25) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative text-center">
            <Workflow className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <div className="font-display text-base font-semibold">Empty canvas</div>
            <div className="mt-1 max-w-sm text-xs text-muted-foreground">
              Drop a trigger from the left to begin a workflow. Visual builder ships in Phase 4.
            </div>
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Actions</div>
          <div className="space-y-2">
            {actions.map((a) => (
              <div key={a.name} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2.5 text-sm">
                <a.icon className="h-4 w-4 text-accent" /> {a.name}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
