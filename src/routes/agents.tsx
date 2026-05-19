import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, Wallet, TrendingUp, MessageSquare, Mail, FileText, ListTodo, Search } from "lucide-react";

export const Route = createFileRoute("/agents")({
  head: () => ({ meta: [{ title: "AI Employees — O.S.I.R.A." }] }),
  component: Agents,
});

const roster = [
  {
    name: "Anubis", role: "HR Agent", icon: Users,
    persona: "Guardian of the workforce. Handles onboarding, leave, policy lookups and employee Q&A.",
    skills: ["Onboarding scripts", "Leave management", "Policy lookup", "Employee surveys"],
    tools: [{ to: "/email", label: "Drafts emails", icon: Mail }],
  },
  {
    name: "Ptah", role: "Operations Agent", icon: Briefcase,
    persona: "Architect of execution. Plans daily ops, summarises meetings, tracks SLAs and incidents.",
    skills: ["Meeting summaries", "Task planning", "Incident triage", "SLA tracking"],
    tools: [
      { to: "/meetings", label: "Meeting summariser", icon: FileText },
      { to: "/tasks", label: "Task planner", icon: ListTodo },
    ],
  },
  {
    name: "Thoth", role: "Finance Agent", icon: Wallet,
    persona: "Scribe of ledgers. Reconciles invoices, forecasts cash flow and flags anomalies.",
    skills: ["Invoice OCR", "Cash forecasting", "Expense classification", "Anomaly detection"],
    tools: [{ to: "/research", label: "Research briefs", icon: Search }],
  },
  {
    name: "Bastet", role: "Sales Agent", icon: TrendingUp,
    persona: "Hunter of opportunity. Qualifies leads, drafts outreach and answers prospect questions on WhatsApp.",
    skills: ["Lead qualification", "Outreach drafts", "Pipeline reporting", "WhatsApp replies"],
    tools: [
      { to: "/chat", label: "Live chatbot", icon: MessageSquare },
      { to: "/email", label: "Email outreach", icon: Mail },
    ],
  },
] as const;

function Agents() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        eyebrow="Multi-agent system"
        title="AI Employees"
        description="Four specialised AI personas, each owning a function. Activate one, give it scope, and it works alongside your team. Currently in standby — agent activation ships in Phase 2."
        phase="Phase 2 · Preview"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {roster.map((a) => (
          <Card key={a.name} className="glass p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <a.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-xl font-semibold">{a.name}</div>
                  <div className="text-xs uppercase tracking-wider text-accent">{a.role}</div>
                </div>
              </div>
              <Badge variant="outline" className="border-muted-foreground/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                Standby
              </Badge>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{a.persona}</p>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {a.skills.map((s) => (
                <span key={s} className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] text-foreground/80">
                  {s}
                </span>
              ))}
            </div>

            {a.tools.length > 0 && (
              <div className="mb-4 space-y-1.5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Available tools</div>
                <div className="flex flex-wrap gap-2">
                  {a.tools.map((t) => (
                    <Link key={t.to} to={t.to} className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent hover:bg-accent/20">
                      <t.icon className="h-3 w-3" /> {t.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Button disabled className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
              Activate {a.name} (Phase 2)
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
