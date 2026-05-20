import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { LayoutDashboard, Mail, FileText, ListTodo, Search, MessageSquare, Clock } from "lucide-react";
import { recentAllGenerations } from "@/lib/generations.functions";
import { supabase } from "@/integrations/supabase/client";

const ROUTES = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Notes", icon: FileText },
  { to: "/tasks", label: "Task Planner", icon: ListTodo },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "AI Chatbot", icon: MessageSquare },
] as const;

const FEATURE_TO_ROUTE: Record<string, string> = {
  email: "/email",
  meeting: "/meetings",
  task: "/tasks",
  research: "/research",
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const fetchRecent = useServerFn(recentAllGenerations);
  const [recent, setRecent] = useState<Array<{ id: string; feature: string; title: string | null; created_at: string }>>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onCustom = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onCustom);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onCustom);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      fetchRecent({ data: undefined as never }).then((r) => {
        if (r.ok) setRecent(r.items);
      }).catch(() => {});
    });
  }, [open, fetchRecent]);

  const go = (to: string) => {
    setOpen(false);
    router.navigate({ to: to as never });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search tools and recent generations…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Tools">
          {ROUTES.map((r) => (
            <CommandItem key={r.to} onSelect={() => go(r.to)}>
              <r.icon className="mr-2 h-4 w-4" />
              {r.label}
            </CommandItem>
          ))}
        </CommandGroup>
        {recent.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent">
              {recent.slice(0, 8).map((r) => (
                <CommandItem key={r.id} onSelect={() => go(FEATURE_TO_ROUTE[r.feature] ?? "/")}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="truncate">{r.title || `${r.feature} generation`}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
