import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

const MAX_BYTES = 2 * 1024 * 1024;

export function FileDrop({ onText, accept = ".txt,.md,.csv,.json" }: { onText: (text: string, filename: string) => void; accept?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    if (file.size > MAX_BYTES) {
      toast.error("File is too large (max 2 MB).");
      return;
    }
    setBusy(true);
    try {
      const text = await file.text();
      if (!text.trim()) {
        toast.error("Couldn't read text from this file.");
        return;
      }
      setName(file.name);
      onText(text, file.name);
      toast.success(`Loaded ${file.name}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to read file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
      }}
      className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <div className="flex items-center gap-2 text-xs">
        {name ? (
          <>
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span className="flex-1 truncate text-foreground">{name}</span>
            <button type="button" onClick={() => setName(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <Upload className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="flex-1 text-muted-foreground">Drop a text file, or</span>
            <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()} disabled={busy}>
              {busy ? "Reading…" : "Browse"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
