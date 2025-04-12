
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Server,
  Zap,
  Clock,
  Wrench,
  Database
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MCPServer } from '@/types/mcp';
import { formatDistanceToNow } from 'date-fns';

interface ServerCardProps {
  server: MCPServer;
}

const ServerCard = ({ server }: ServerCardProps) => {
  const navigate = useNavigate();
  
  const getStatusColor = () => {
    switch (server.deploymentState) {
      case 'DEPLOYED':
        return 'bg-green-500';
      case 'DEPLOYING':
        return 'bg-amber-500';
      case 'FAILED':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };
  
  const getStatusText = () => {
    switch (server.deploymentState) {
      case 'DEPLOYED':
        return 'Deployed';
      case 'DEPLOYING':
        return 'Deploying';
      case 'FAILED':
        return 'Failed';
      default:
        return 'Not Deployed';
    }
  };
  
  const handleCardClick = () => {
    navigate(`/server/${server.id}`);
  };
  
  const lastUpdated = formatDistanceToNow(new Date(server.updatedAt), { addSuffix: true });
  
  return (
    <Card 
      className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer animate-fade-in"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{server.name}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
            <span className="text-xs text-muted-foreground">{getStatusText()}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {server.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <span>{server.tools.length} Tools</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span>{server.resources.length} Resources</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/30 px-6 py-3 border-t flex justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Updated {lastUpdated}</span>
        </div>
        
        {server.deploymentState === 'DEPLOYED' ? (
          <Badge variant="outline" className="text-xs border-mcp-teal-500 text-mcp-teal-500 gap-1">
            <Zap className="h-3 w-3" />
            Live
          </Badge>
        ) : (
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Deploy
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServerCard;
