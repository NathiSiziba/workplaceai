import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listGenerations, deleteGeneration } from "@/lib/generations.functions";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Item = { id: string; title: string | null; input: string; output: string; created_at: string };

export function HistoryPanel({
  feature,
  onLoad,
  refreshKey = 0,
}: {
  feature: string;
  onLoad: (item: Item) => void;
  refreshKey?: number;
}) {
  const fetchList = useServerFn(listGenerations);
  const del = useServerFn(deleteGeneration);
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchList({ data: { feature, limit: 20 } });
    if (res.ok) setItems(res.items as Item[]);
    setLoading(false);
  }, [fetchList, feature]);

  useEffect(() => { load(); }, [load, refreshKey]);

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          History {items.length > 0 && <span className="text-xs text-muted-foreground">({items.length})</span>}
        </span>
        <span className="text-xs text-muted-foreground">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="max-h-80 overflow-y-auto border-t border-border">
          {loading && <div className="p-4 text-xs text-muted-foreground">Loading…</div>}
          {!loading && items.length === 0 && (
            <div className="p-4 text-xs text-muted-foreground">No saved generations yet.</div>
          )}
          {items.map((it) => (
            <div key={it.id} className="group flex items-start gap-2 border-b border-border px-4 py-2.5 last:border-0 hover:bg-accent/40">
              <button
                onClick={() => onLoad(it)}
                className="flex flex-1 flex-col items-start gap-0.5 text-left"
              >
                <span className="line-clamp-1 text-xs font-medium text-foreground">
                  {it.title || it.input.slice(0, 60)}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(it.created_at), { addSuffix: true })}
                </span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100"
                onClick={async () => {
                  await del({ data: { id: it.id } });
                  load();
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
