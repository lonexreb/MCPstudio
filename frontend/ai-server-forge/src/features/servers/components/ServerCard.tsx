
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Server,
  Zap,
  Clock,
  Wrench,
  Plug,
  PlugZap,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServerResponse } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';

interface ServerCardProps {
  server: ServerResponse;
}

const ServerCard = ({ server }: ServerCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    switch (server.status) {
      case 'connected':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusText = () => {
    switch (server.status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  };

  const handleCardClick = () => {
    navigate(`/server/${server.id}`);
  };

  const lastUpdated = formatDistanceToNow(new Date(server.updated_at), { addSuffix: true });

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
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono truncate max-w-[180px]">
            <Plug className="h-4 w-4 shrink-0" />
            <span className="truncate">{server.connection_url}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 px-6 py-3 border-t flex justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Updated {lastUpdated}</span>
        </div>

        {server.status === 'connected' ? (
          <Badge variant="outline" className="text-xs border-green-500 text-green-500 gap-1">
            <PlugZap className="h-3 w-3" />
            Live
          </Badge>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/server/${server.id}`);
            }}
          >
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServerCard;
