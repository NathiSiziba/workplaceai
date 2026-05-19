import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle, CreditCard, Plug } from "lucide-react";

export const Route = createFileRoute("/settings/integrations")({
  head: () => ({ meta: [{ title: "Integrations — O.S.I.R.A." }] }),
  component: Integrations,
});

const integrations = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: MessageCircle,
    desc: "Two-way customer chat, driver check-ins and agent escalation via Meta Cloud API.",
    needs: "Meta Cloud API access token, phone number ID, and a verified business display name.",
  },
  {
    id: "payfast",
    name: "PayFast",
    icon: CreditCard,
    desc: "Accept ZAR card, EFT and Mobicred payments. Reconciliation via ITN webhook.",
    needs: "Merchant ID, merchant key, and passphrase from your PayFast dashboard.",
  },
];

function Integrations() {
  const [open, setOpen] = useState<null | (typeof integrations)[number]>(null);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        eyebrow="Connections"
        title="Integrations"
        description="Connect O.S.I.R.A. to the South African business stack. Provider credentials are required to activate."
        phase="Phase 6 · Preview"
      />

      <div className="grid gap-5 md:grid-cols-2">
        {integrations.map((i) => (
          <Card key={i.id} className="glass p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <i.icon className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="border-muted-foreground/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                Not connected
              </Badge>
            </div>
            <div className="font-display text-lg font-semibold">{i.name}</div>
            <p className="mt-1 text-sm text-muted-foreground">{i.desc}</p>
            <Button
              onClick={() => setOpen(i)}
              className="mt-5 w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              <Plug className="mr-2 h-4 w-4" /> Connect {i.name}
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle>{open?.name} setup</DialogTitle>
            <DialogDescription className="pt-2 text-muted-foreground">
              This integration is part of Phase 6. To activate it now, you'll need:
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-foreground">
            {open?.needs}
          </div>
          <div className="text-xs text-muted-foreground">
            Once you have these credentials, ask O.S.I.R.A. to wire the integration and the workflow
            will be enabled across all relevant AI employees.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
