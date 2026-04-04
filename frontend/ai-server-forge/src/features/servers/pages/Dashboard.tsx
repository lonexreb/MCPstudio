
import React from 'react';
import { Server, Zap, Workflow, Swords } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ServerList from '@/features/servers/components/ServerList';
import { useServers } from '@/features/servers/hooks/use-servers';
import { Skeleton } from '@/components/ui/skeleton';

const stats = [
  { label: 'Servers', icon: Server, color: 'from-blue-500 to-cyan-400', bg: 'bg-blue-500/10', textColor: 'text-blue-400' },
  { label: 'Executions', icon: Zap, color: 'from-amber-500 to-orange-400', bg: 'bg-amber-500/10', textColor: 'text-amber-400' },
  { label: 'Pipelines', icon: Workflow, color: 'from-purple-500 to-pink-400', bg: 'bg-purple-500/10', textColor: 'text-purple-400' },
  { label: 'Comparisons', icon: Swords, color: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-500/10', textColor: 'text-emerald-400' },
];

const Index = () => {
  const { data: servers, isLoading, error } = useServers();

  return (
    <MainLayout title="Dashboard" subtitle="Manage your MCP servers and tools">
      <div className="space-y-8">
        {/* Hero banner */}
        <div data-tour="dashboard-hero" className="relative overflow-hidden rounded-2xl p-8 gradient-brand shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to MCPStudio</h2>
            <p className="text-white/70 max-w-lg">
              Create, test, and manage Model Context Protocol servers. Build visual pipelines, compare executions, and export configs.
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="group relative">
              <div className={`absolute -inset-[1px] rounded-xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-[1px]`} />
              <div className="relative flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-transparent transition-all">
                <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.label === 'Servers' ? (servers?.length ?? '-') : '-'}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Server list */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="border border-red-500/30 rounded-xl p-8 text-center bg-red-500/5">
            <h3 className="text-lg font-medium mb-2 text-red-400">Failed to load servers</h3>
            <p className="text-sm text-muted-foreground">
              Make sure the backend is running. Check the console for details.
            </p>
          </div>
        ) : (
          <ServerList servers={servers || []} />
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
