
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Server,
  Wrench,
  Database,
  Lightbulb,
  Settings,
  PlusCircle,
  Package,
  Layout,
  LifeBuoy,
  Workflow,
  Swords,
  Clock,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  href: string;
  color?: string;
  dataTour?: string;
}

const SidebarItem = ({ icon: Icon, label, active, href, color = 'text-muted-foreground', dataTour }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      data-tour={dataTour}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        active
          ? "bg-white/10 text-white shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5 transition-colors", active ? 'text-white' : color)} />
      <span>{label}</span>
      {active && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full gradient-brand" />
      )}
    </Link>
  );
};

interface SidebarProps {
  activePath?: string;
}

const Sidebar = ({ activePath = "/" }: SidebarProps) => {
  return (
    <div data-tour="sidebar" className="w-64 h-screen flex flex-col border-r border-white/5 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, hsl(250, 30%, 8%) 0%, hsl(240, 25%, 6%) 100%)' }}
    >
      {/* Subtle gradient orb in background */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl gradient-brand pointer-events-none" />
      <div className="absolute bottom-20 -left-10 w-32 h-32 rounded-full opacity-10 blur-3xl bg-mcp-teal-500 pointer-events-none" />

      <div className="px-4 py-5 relative">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg gradient-brand flex items-center justify-center shadow-lg glow-purple">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient-brand">MCPStudio</h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Server Forge</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 relative">
        <Link
          to="/new-server"
          data-tour="new-server"
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white gradient-brand hover:gradient-brand-hover transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/20"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New MCP Server</span>
        </Link>
      </div>

      <div className="px-3 py-3 relative flex-1">
        <p className="text-[10px] font-semibold text-muted-foreground/60 mb-2 px-3 tracking-widest uppercase">Navigation</p>
        <nav className="space-y-0.5">
          <SidebarItem
            icon={Server}
            label="Servers"
            href="/"
            active={activePath === "/" || activePath.startsWith("/server/")}
            color="text-mcp-blue-400"
          />
          <SidebarItem
            icon={Wrench}
            label="Tools Library"
            href="/tools"
            active={activePath === "/tools"}
            color="text-mcp-orange-400"
            dataTour="tools-nav"
          />
          <SidebarItem
            icon={Database}
            label="Resources"
            href="/resources"
            active={activePath === "/resources"}
            color="text-mcp-teal-400"
          />
          <SidebarItem
            icon={Lightbulb}
            label="Prompt Templates"
            href="/prompts"
            active={activePath === "/prompts"}
            color="text-yellow-400"
          />
          <SidebarItem
            icon={Workflow}
            label="Pipelines"
            href="/pipelines"
            active={activePath === "/pipelines" || activePath.startsWith("/pipelines/")}
            color="text-mcp-purple-400"
            dataTour="pipelines-nav"
          />
          <SidebarItem
            icon={Swords}
            label="Arena"
            href="/arena"
            active={activePath === "/arena"}
            color="text-mcp-pink-400"
            dataTour="arena-nav"
          />
          <SidebarItem
            icon={Clock}
            label="History"
            href="/history"
            active={activePath === "/history"}
            color="text-mcp-orange-400"
          />
          <SidebarItem
            icon={Compass}
            label="Discover"
            href="/discover"
            active={activePath === "/discover"}
            color="text-mcp-cyan-400"
          />
        </nav>
      </div>

      <div className="px-3 py-4 border-t border-white/5 relative">
        <div className="space-y-0.5">
          <SidebarItem
            icon={Layout}
            label="Documentation"
            href="/docs"
            active={activePath === "/docs"}
            color="text-muted-foreground/60"
          />
          <SidebarItem
            icon={LifeBuoy}
            label="Help & Support"
            href="/support"
            active={activePath === "/support"}
            color="text-muted-foreground/60"
          />
          <SidebarItem
            icon={Settings}
            label="Settings"
            href="/settings"
            active={activePath === "/settings"}
            color="text-muted-foreground/60"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
