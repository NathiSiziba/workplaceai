import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  phase?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, phase, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        {eyebrow && (
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {phase && (
          <Badge
            variant="outline"
            className="border-accent/40 bg-accent/10 text-accent uppercase tracking-wider text-[10px]"
          >
            {phase}
          </Badge>
        )}
        {actions}
      </div>
    </div>
  );
}
