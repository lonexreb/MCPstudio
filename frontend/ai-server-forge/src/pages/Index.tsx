
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ServerList from '@/components/server/ServerList';
import { MCPServer, sampleServers } from '@/types/mcp';

const Index = () => {
  // In a real application, this would come from an API
  const [servers, setServers] = useState<MCPServer[]>(sampleServers);
  
  return (
    <MainLayout title="AI Server Forge" subtitle="Create and manage MCP servers for AI agents">
      <ServerList servers={servers} />
    </MainLayout>
  );
};

export default Index;
