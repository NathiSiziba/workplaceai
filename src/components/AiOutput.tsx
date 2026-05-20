import { Copy, Check, AlertCircle, Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AiOutput({
  content,
  loading,
  onRegenerate,
  filename = "workai-output.md",
}: {
  content: string;
  loading?: boolean;
  onRegenerate?: () => void;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="space-y-3">
        {[3, 4, 5, 2, 4].map((w, i) => (
          <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${50 + w * 10}%` }} />
        ))}
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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
          <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const blob = new Blob([content], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          <span className="text-xs">Download</span>
        </Button>
        {onRegenerate && (
          <Button size="sm" variant="outline" onClick={onRegenerate}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            <span className="text-xs">Regenerate</span>
          </Button>
        )}
      </div>
      <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground animate-in fade-in duration-300">
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
