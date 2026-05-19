import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Database,
  Workflow,
  LineChart,
  Mic,
  Truck,
  Shield,
  Plug,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const core = [
  { title: "Command Center", url: "/", icon: LayoutDashboard },
  { title: "AI Employees", url: "/agents", icon: Users },
  { title: "Knowledge Vault", url: "/vault", icon: Database },
  { title: "Workflow Studio", url: "/studio", icon: Workflow },
  { title: "Analytics", url: "/analytics", icon: LineChart },
  { title: "Voice Assistant", url: "/voice", icon: Mic },
];

const industry = [
  { title: "Logistics Hub", url: "/logistics", icon: Truck },
];

const settings = [
  { title: "Compliance (POPIA)", url: "/settings/compliance", icon: Shield },
  { title: "Integrations", url: "/settings/integrations", icon: Plug },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const renderGroup = (label: string, items: typeof core) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/50">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = pathname === item.url;
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                  <Link to={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow animate-pulse-glow">
            <Zap className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-bold tracking-[0.22em] text-sidebar-foreground">
              O.S.I.R.A.
            </span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-sidebar-foreground/50">
              Operating System
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Core", core)}
        {renderGroup("Industry", industry)}
        {renderGroup("System", settings)}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-2 text-[10px] leading-snug text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
          Afro-futurist AI · Built for Africa
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
