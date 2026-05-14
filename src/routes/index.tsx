import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FileText, ListTodo, Search, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI" },
      { name: "description", content: "Your AI productivity command center." },
    ],
  }),
  component: Dashboard,
});

const features = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Compose tone- and audience-tailored emails in seconds." },
  { to: "/meetings", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn raw notes into key points, decisions, and action items." },
  { to: "/tasks", icon: ListTodo, title: "AI Task Planner", desc: "Prioritize and schedule your day with smart reasoning." },
  { to: "/research", icon: Search, title: "AI Research Assistant", desc: "Insights, context, and risks on any topic." },
  { to: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Your always-on workplace thinking partner." },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant">
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Good to see you.</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a tool to get more done — your AI workplace assistant is ready.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link key={f.to} to={f.to} className="group">
            <Card className="h-full border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{f.title}</CardTitle>
                <CardDescription className="text-xs">{f.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-card p-5 text-xs text-muted-foreground shadow-card">
        <strong className="font-semibold text-foreground">Note:</strong> AI-generated content may require human review before sending or publishing.
      </div>
    </div>
  );
}
