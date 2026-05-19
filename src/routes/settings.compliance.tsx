import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/settings/compliance")({
  head: () => ({ meta: [{ title: "POPIA Compliance — O.S.I.R.A." }] }),
  component: Compliance,
});

const items = [
  { title: "User consent capture", status: "ok", note: "Auth flow records explicit consent on signup." },
  { title: "Data residency (in-region)", status: "ok", note: "All workloads run in af-south-1 / eu-west." },
  { title: "Audit log of AI actions", status: "pending", note: "Activates with Phase 2 agent system." },
  { title: "Data Subject Access Request (DSAR) flow", status: "pending", note: "Self-service export ships Phase 3." },
  { title: "Right to be forgotten", status: "pending", note: "Vault deletion API ships Phase 3." },
  { title: "Operator agreements on file", status: "ok", note: "Sub-processor list maintained." },
  { title: "Breach notification process", status: "ok", note: "72-hour notification commitment in TOS." },
  { title: "Information Officer registered", status: "warn", note: "Register your IO with the Information Regulator." },
];

const statusMap = {
  ok: { color: "text-success border-success/30 bg-success/10", icon: Check, label: "Compliant" },
  pending: { color: "text-muted-foreground border-muted-foreground/30 bg-muted/30", icon: AlertCircle, label: "Pending" },
  warn: { color: "text-warning border-warning/40 bg-warning/10", icon: AlertCircle, label: "Action needed" },
} as const;

function Compliance() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        eyebrow="POPIA · GDPR-aligned"
        title="Compliance"
        description="South Africa's Protection of Personal Information Act compliance status for your O.S.I.R.A. workspace."
        phase="Live"
      />

      <Card className="glass mb-6 flex items-start gap-4 p-5">
        <Shield className="mt-0.5 h-6 w-6 text-success" />
        <div>
          <div className="font-display text-base font-semibold">Your POPIA posture: 5 of 8 controls complete</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Remaining items unlock automatically as you enable Phase 2 and Phase 3 features.
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {items.map((it) => {
          const s = statusMap[it.status as keyof typeof statusMap];
          return (
            <Card key={it.title} className="glass flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{it.title}</div>
                  <div className="text-xs text-muted-foreground">{it.note}</div>
                </div>
              </div>
              <Badge variant="outline" className={`uppercase tracking-wider text-[10px] ${s.color}`}>
                {s.label}
              </Badge>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
