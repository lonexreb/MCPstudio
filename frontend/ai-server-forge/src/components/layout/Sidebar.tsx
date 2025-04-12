
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
  LifeBuoy
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, active, href }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

interface SidebarProps {
  activePath?: string;
}

const Sidebar = ({ activePath = "/" }: SidebarProps) => {
  return (
    <div className="w-64 h-screen bg-sidebar flex flex-col border-r border-border">
      <div className="px-4 py-5">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-mcp-blue-400" />
          <h1 className="text-xl font-bold">AI Server Forge</h1>
        </div>
      </div>
      
      <div className="px-3 py-2">
        <div className="mb-1">
          <Link 
            to="/new-server"
            className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New MCP Server</span>
          </Link>
        </div>
      </div>
      
      <div className="px-3 py-2">
        <p className="text-xs font-semibold text-muted-foreground mb-2 px-3">NAVIGATION</p>
        <nav className="space-y-1">
          <SidebarItem 
            icon={Server} 
            label="Servers" 
            href="/" 
            active={activePath === "/" || activePath.startsWith("/server/")} 
          />
          <SidebarItem 
            icon={Wrench} 
            label="Tools Library" 
            href="/tools" 
            active={activePath === "/tools"} 
          />
          <SidebarItem 
            icon={Database} 
            label="Resources" 
            href="/resources" 
            active={activePath === "/resources"} 
          />
          <SidebarItem 
            icon={Lightbulb} 
            label="Prompt Templates" 
            href="/prompts" 
            active={activePath === "/prompts"} 
          />
        </nav>
      </div>
      
      <div className="mt-auto px-3 py-4">
        <div className="space-y-1">
          <SidebarItem 
            icon={Layout} 
            label="Documentation" 
            href="/docs" 
            active={activePath === "/docs"} 
          />
          <SidebarItem 
            icon={LifeBuoy} 
            label="Help & Support" 
            href="/support" 
            active={activePath === "/support"} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            href="/settings" 
            active={activePath === "/settings"} 
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
