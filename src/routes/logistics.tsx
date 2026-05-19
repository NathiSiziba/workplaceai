import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Truck, MapPin, Users, Package } from "lucide-react";

export const Route = createFileRoute("/logistics")({
  head: () => ({ meta: [{ title: "Logistics Hub — O.S.I.R.A." }] }),
  component: Logistics,
});

const stats = [
  { label: "Vehicles", value: "—", icon: Truck },
  { label: "Active routes", value: "—", icon: MapPin },
  { label: "Drivers checked in", value: "—", icon: Users },
  { label: "Deliveries today", value: "—", icon: Package },
];

function Logistics() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        eyebrow="Industry template"
        title="Logistics Hub"
        description="Fleet, drivers and routes in one operating view. Built for transport, last-mile and cross-border operators across Africa."
        phase="Phase 1 · Template"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass p-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </div>
              <s.icon className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-3 font-display text-2xl font-semibold">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="glass overflow-hidden p-0">
          <div className="border-b border-border p-5">
            <div className="font-display text-base font-semibold">Live route map</div>
            <div className="text-xs text-muted-foreground">Real-time fleet tracking</div>
          </div>
          <div
            className="relative flex h-80 items-center justify-center bg-muted/20"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.78 0.13 200 / 0.06) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.13 200 / 0.06) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          >
            <div className="text-center">
              <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <div className="text-sm text-muted-foreground">Connect telematics to view fleet</div>
            </div>
          </div>
        </Card>

        <Card className="glass p-5">
          <div className="mb-4 font-display text-base font-semibold">Driver check-ins</div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="mb-2 h-7 w-7 text-muted-foreground/40" />
            <div className="text-sm text-muted-foreground">No drivers checked in</div>
            <div className="mt-1 text-xs text-muted-foreground/70">
              WhatsApp check-in launches in Phase 6
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
