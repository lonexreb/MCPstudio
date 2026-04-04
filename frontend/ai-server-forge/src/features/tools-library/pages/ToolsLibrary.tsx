import { useMemo, useState } from 'react';
import { Wrench } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllTools } from '../hooks/use-all-tools';
import ToolCard from '../components/ToolCard';
import ToolFilters from '../components/ToolFilters';

const ToolsLibrary = () => {
  const { data: tools, isLoading, error } = useAllTools();
  const [search, setSearch] = useState('');
  const [serverFilter, setServerFilter] = useState('all');

  const serverNames = useMemo(() => {
    if (!tools) return [];
    return [...new Set(tools.map((t) => t.server_name))].sort();
  }, [tools]);

  const filtered = useMemo(() => {
    if (!tools) return [];
    return tools.filter((tool) => {
      const matchesSearch =
        !search ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesServer =
        serverFilter === 'all' || tool.server_name === serverFilter;
      return matchesSearch && matchesServer;
    });
  }, [tools, search, serverFilter]);

  return (
    <MainLayout title="Tools Library" subtitle="Browse all tools across your MCP servers">
      <div className="space-y-6">
        {/* Hero */}
        <div data-tour="tools-hero" className="relative overflow-hidden rounded-2xl p-6 gradient-warm shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Tools Library</h2>
              <p className="text-white/70 text-sm">
                {tools ? `${tools.length} tool${tools.length !== 1 ? 's' : ''}` : 'Loading...'} across all servers
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ToolFilters
          search={search}
          onSearchChange={setSearch}
          serverFilter={serverFilter}
          onServerFilterChange={setServerFilter}
          serverNames={serverNames}
        />

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="border border-red-500/30 rounded-xl p-8 text-center bg-red-500/5">
            <h3 className="text-lg font-medium mb-2 text-red-400">Failed to load tools</h3>
            <p className="text-sm text-muted-foreground">
              Make sure the backend is running and servers are connected.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-border/50 rounded-xl p-12 text-center">
            <Wrench className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No tools found</h3>
            <p className="text-sm text-muted-foreground">
              {tools?.length === 0
                ? 'Connect a server and discover tools to see them here.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ToolsLibrary;
