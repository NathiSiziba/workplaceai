import { Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AiOutput({ content, loading }: { content: string; loading?: boolean }) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-muted-foreground">
        <div className="mb-3 rounded-full bg-accent p-3">
          <AlertCircle className="h-5 w-5 text-accent-foreground" />
        </div>
        Output will appear here once generated.
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
        className="absolute right-0 top-0"
        onClick={() => {
          navigator.clipboard.writeText(content);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy"}</span>
      </Button>
      <pre className="whitespace-pre-wrap break-words pr-20 font-sans text-sm leading-relaxed text-foreground">
        {content}
      </pre>
    </div>
  );
}

export function Disclaimer() {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
      <span>AI-generated content may require human review before use.</span>
    </div>
  );
}
