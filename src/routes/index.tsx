import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Truck,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Brain,
  Briefcase,
  Wallet,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center — O.S.I.R.A." },
      { name: "description", content: "O.S.I.R.A. — Afro-futurist AI operating system for African businesses." },
    ],
  }),
  component: CommandCenter,
});

const kpis = [
  { label: "AI Employees Active", value: "0 / 4", icon: Users, trend: "Setup pending" },
  { label: "Fleet On Duty", value: "—", icon: Truck, trend: "Connect logistics" },
  { label: "Workflows Running", value: "0", icon: Activity, trend: "Studio idle" },
  { label: "Alerts", value: "0", icon: AlertTriangle, trend: "All clear" },
];

const agents = [
  { name: "Anubis", role: "HR", icon: Users, status: "standby" },
  { name: "Ptah", role: "Operations", icon: Briefcase, status: "standby" },
  { name: "Thoth", role: "Finance", icon: Wallet, status: "standby" },
  { name: "Bastet", role: "Sales", icon: TrendingUp, status: "standby" },
];

function CommandCenter() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        eyebrow="Command Center"
        title={
          <>
            Welcome to <span className="text-gradient-primary">O.S.I.R.A.</span>
          </>
        }
        description="An Afro-futurist AI operating system orchestrating your AI employees, knowledge, workflows and operations — built for African enterprise."
        phase="Phase 1 · Shell"
      />

      {/* KPI strip */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="glass p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {k.label}
                </div>
                <div className="mt-2 font-display text-3xl font-semibold text-foreground">
                  {k.value}
                </div>
                <div className="mt-1 text-xs text-accent">{k.trend}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <k.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI employees */}
      <div className="mb-8">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-lg font-semibold">AI Employees</h2>
          <Link to="/agents" className="flex items-center gap-1 text-xs text-accent hover:underline">
            Manage roster <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((a) => (
            <Card key={a.name} className="glass group p-5 transition-all hover:shadow-glow">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                  <a.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="border-muted-foreground/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {a.status}
                </Badge>
              </div>
              <div className="font-display text-base font-semibold text-foreground">{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.role} agent</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Activity placeholder */}
      <Card className="glass p-6">
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 text-accent" />
          <h2 className="font-display text-base font-semibold">System Activity</h2>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 text-sm text-muted-foreground">No activity yet.</div>
          <div className="max-w-md text-xs text-muted-foreground/70">
            Activate an AI employee, upload to the Knowledge Vault, or wire a workflow to start
            generating system events.
          </div>
        </div>
      </Card>
    </div>
  );
}
