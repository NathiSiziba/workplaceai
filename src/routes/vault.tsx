import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Search, FileText, Lock } from "lucide-react";

export const Route = createFileRoute("/vault")({
  head: () => ({ meta: [{ title: "Knowledge Vault — O.S.I.R.A." }] }),
  component: Vault,
});

function Vault() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        eyebrow="Enterprise knowledge"
        title="Knowledge Vault"
        description="Upload policies, contracts, manuals and reports. O.S.I.R.A. embeds them and makes every AI employee fluent in your organisation. POPIA-compliant, data stays in-region."
        phase="Phase 3 · Preview"
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Card className="glass p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Search className="h-4 w-4 text-accent" /> Semantic search
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              disabled
              placeholder="Ask a question across all documents…"
              className="h-11 pl-9"
            />
          </div>
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
            <FileText className="mb-3 h-8 w-8 text-muted-foreground/40" />
            <div className="text-sm text-muted-foreground">No documents indexed yet</div>
            <div className="mt-1 text-xs text-muted-foreground/70">
              Upload to make your knowledge searchable
            </div>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Upload className="h-4 w-4 text-accent" /> Upload documents
          </div>
          <div className="rounded-xl border-2 border-dashed border-accent/30 bg-accent/5 p-8 text-center">
            <Upload className="mx-auto mb-3 h-8 w-8 text-accent" />
            <div className="text-sm font-medium text-foreground">Drop files here</div>
            <div className="mt-1 text-xs text-muted-foreground">PDF · DOCX · TXT · MD up to 20MB</div>
            <Button disabled className="mt-5 bg-gradient-primary text-primary-foreground">
              Browse files (Phase 3)
            </Button>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
            <Lock className="mt-0.5 h-4 w-4 text-success" />
            <div className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">POPIA-aligned.</span> Documents are
              encrypted at rest, processed in-region, and never used to train foundation models.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
