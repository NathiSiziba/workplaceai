import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { AuthGate } from "@/components/AuthGate";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "O.S.I.R.A. — Afro-futurist AI Operating System" },
      { name: "description", content: "Multi-agent AI employees, knowledge vault, workflow automation, voice and analytics — built for African enterprise." },
      { name: "author", content: "O.S.I.R.A." },
      { name: "theme-color", content: "#0a1614" },
      { property: "og:title", content: "O.S.I.R.A. — Afro-futurist AI Operating System" },
      { property: "og:description", content: "Multi-agent AI employees, knowledge vault, workflow automation, voice and analytics — built for African enterprise." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "O.S.I.R.A. — Afro-futurist AI OS" },
      { name: "twitter:description", content: "Multi-agent AI employees, knowledge vault, workflow automation, voice and analytics for African enterprise." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const MARQUEE = [
  "⚡ O.S.I.R.A. v1 · Phase 1 shell live",
  "🛡️ POPIA-aligned · data stays in-region",
  "🤖 Multi-agent AI employees: Anubis · Ptah · Thoth · Bastet",
  "📚 Knowledge Vault with semantic search — Phase 3",
  "🚚 Logistics & construction templates",
  "💬 WhatsApp + 💳 PayFast integrations — Phase 6",
  "🌍 Built for African enterprise",
];

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              <header className="glass-strong sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border px-4">
                <SidebarTrigger className="text-foreground hover:text-accent" />
                <div className="font-display text-sm font-bold tracking-[0.2em] text-foreground">
                  O.S.I.R.A.
                </div>
                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
                  · Operating System for Intelligent Resource Automation
                </span>
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => supabase.auth.signOut()}
                  >
                    <LogOut className="mr-1.5 h-4 w-4" /> Sign out
                  </Button>
                </div>
              </header>

              {/* Marquee announcement bar */}
              <div className="relative h-9 overflow-hidden border-b border-border bg-gradient-primary">
                <div className="animate-marquee flex h-full items-center whitespace-nowrap text-xs font-medium text-primary-foreground">
                  {[...MARQUEE, ...MARQUEE].map((m, i) => (
                    <span key={i} className="mx-6 inline-flex items-center">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <main className="flex-1">
                <Outlet />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </AuthGate>
      <Toaster />
    </QueryClientProvider>
  );
}
