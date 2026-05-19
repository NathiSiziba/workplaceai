import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { TrendingUp, BarChart3, LineChart, PieChart } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — O.S.I.R.A." }] }),
  component: Analytics,
});

const charts = [
  { title: "Revenue forecast", icon: LineChart, hint: "Predictive · 90-day horizon" },
  { title: "Agent productivity", icon: BarChart3, hint: "Tasks resolved per agent" },
  { title: "Fleet utilisation", icon: PieChart, hint: "Active vs idle vehicles" },
  { title: "Customer sentiment", icon: TrendingUp, hint: "From WhatsApp + email" },
];

function Analytics() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        eyebrow="Predictive intelligence"
        title="Analytics"
        description="Forecasting, anomaly detection and operational insights drawn from your agents, vault and integrations."
        phase="Phase 7 · Preview"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {charts.map((c) => (
          <Card key={c.title} className="glass p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="font-display text-base font-semibold">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.hint}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="relative h-44 overflow-hidden rounded-lg border border-border bg-muted/20">
              <svg viewBox="0 0 400 160" className="absolute inset-0 h-full w-full">
                <defs>
                  <linearGradient id={`g-${c.title}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.16 155)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="oklch(0.68 0.16 155)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,120 C60,90 100,110 160,80 C220,50 260,90 320,60 C360,40 380,55 400,45 L400,160 L0,160 Z"
                  fill={`url(#g-${c.title})`}
                />
                <path
                  d="M0,120 C60,90 100,110 160,80 C220,50 260,90 320,60 C360,40 380,55 400,45"
                  fill="none"
                  stroke="oklch(0.78 0.13 200)"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute bottom-2 right-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                Sample · awaiting data
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
