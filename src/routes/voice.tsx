import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Mic, Volume2 } from "lucide-react";

export const Route = createFileRoute("/voice")({
  head: () => ({ meta: [{ title: "Voice Assistant — O.S.I.R.A." }] }),
  component: Voice,
});

function Voice() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        eyebrow="Hands-free"
        title="Voice Assistant"
        description="Talk to O.S.I.R.A. in English, isiZulu, Yoruba, Swahili or French. Brief your agents, query the vault, dispatch workflows — by voice."
        phase="Phase 5 · Preview"
      />

      <Card className="glass relative overflow-hidden p-12 text-center">
        <div className="bg-gradient-glow absolute inset-0 opacity-50" />
        <div className="relative">
          <button
            disabled
            className="group mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-primary shadow-glow animate-pulse-glow disabled:cursor-not-allowed"
          >
            <Mic className="h-12 w-12 text-primary-foreground" />
          </button>
          <div className="mt-6 font-display text-lg font-semibold">Tap to speak</div>
          <div className="mt-1 text-sm text-muted-foreground">Voice interface activates in Phase 5</div>

          {/* fake waveform */}
          <div className="mt-10 flex items-end justify-center gap-1 h-16">
            {Array.from({ length: 40 }).map((_, i) => {
              const h = 20 + Math.abs(Math.sin(i * 0.7)) * 50;
              return (
                <div
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-primary to-accent opacity-40"
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Volume2 className="h-3.5 w-3.5" /> Multi-language · low-latency · privacy-first
          </div>
        </div>
      </Card>
    </div>
  );
}
