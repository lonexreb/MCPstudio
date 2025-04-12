
import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MCPServer } from '@/types/mcp';
import ServerCard from './ServerCard';

interface ServerListProps {
  servers: MCPServer[];
}

const ServerList = ({ servers }: ServerListProps) => {
  const navigate = useNavigate();
  
  const handleNewServer = () => {
    navigate('/new-server');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your MCP Servers</h2>
        <Button onClick={handleNewServer}>
          <Plus className="h-4 w-4 mr-2" />
          New Server
        </Button>
      </div>
      
      {servers.length === 0 ? (
        <div className="border border-dashed rounded-md p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No servers yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first MCP server to get started
          </p>
          <Button onClick={handleNewServer}>
            <Plus className="h-4 w-4 mr-2" />
            Create Server
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServerList;
