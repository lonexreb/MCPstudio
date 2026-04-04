import { Database } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useServers } from '@/features/servers/hooks/use-servers';
import { useResources } from '../hooks/use-resources';
import ResourceCard from '../components/ResourceCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const ResourcesPage = () => {
  const { data: servers } = useServers();
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const { data: resources, isLoading } = useResources(selectedServerId || undefined);

  const connectedServers = servers?.filter((s) => s.status === 'connected') || [];

  return (
    <MainLayout title="Resources" subtitle="Browse data sources from connected MCP servers">
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl p-6 gradient-cool shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Resources</h2>
              <p className="text-white/70 text-sm">
                Data sources and external services exposed by your MCP servers
              </p>
            </div>
          </div>
        </div>

        {/* Server selector */}
        <Select value={selectedServerId} onValueChange={setSelectedServerId}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a connected server..." />
          </SelectTrigger>
          <SelectContent>
            {connectedServers.map((server) => (
              <SelectItem key={server.id} value={server.id}>
                {server.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Content */}
        {!selectedServerId ? (
          <div className="border border-border/50 rounded-xl p-12 text-center">
            <Database className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Select a server</h3>
            <p className="text-sm text-muted-foreground">
              {connectedServers.length === 0
                ? 'Connect a server first to browse its resources.'
                : 'Choose a connected server to view its resources.'}
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : resources && resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.uri}
                resource={resource}
                serverName={connectedServers.find((s) => s.id === selectedServerId)?.name}
              />
            ))}
          </div>
        ) : (
          <div className="border border-border/50 rounded-xl p-12 text-center">
            <Database className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No resources found</h3>
            <p className="text-sm text-muted-foreground">
              This server doesn't expose any resources, or resource discovery is not supported.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ResourcesPage;
