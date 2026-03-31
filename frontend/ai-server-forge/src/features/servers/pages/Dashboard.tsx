
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ServerList from '@/features/servers/components/ServerList';
import { useServers } from '@/features/servers/hooks/use-servers';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: servers, isLoading, error } = useServers();

  return (
    <MainLayout title="AI Server Forge" subtitle="Create and manage MCP servers for AI agents">
      {isLoading ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="border border-destructive/50 rounded-md p-8 text-center">
          <h3 className="text-lg font-medium mb-2 text-destructive">Failed to load servers</h3>
          <p className="text-sm text-muted-foreground">
            Make sure the backend is running on port 8000
          </p>
        </div>
      ) : (
        <ServerList servers={servers || []} />
      )}
    </MainLayout>
  );
};

export default Index;
