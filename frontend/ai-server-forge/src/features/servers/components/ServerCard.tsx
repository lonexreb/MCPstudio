
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

  const getStatusConfig = () => {
    switch (server.status) {
      case 'connected':
        return { dot: 'gradient-success', text: 'Connected', textColor: 'text-emerald-400' };
      case 'error':
        return { dot: 'gradient-warm', text: 'Error', textColor: 'text-red-400' };
      default:
        return { dot: 'bg-slate-500', text: 'Disconnected', textColor: 'text-slate-400' };
    }
  };

  const status = getStatusConfig();

  const handleCardClick = () => {
    navigate(`/server/${server.id}`);
  };

  const lastUpdated = formatDistanceToNow(new Date(server.updated_at), { addSuffix: true });

  return (
    <div className="group relative animate-fade-in">
      {/* Gradient border glow on hover */}
      <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 gradient-brand blur-[2px]" />
      <Card
        className="relative overflow-hidden transition-all duration-300 cursor-pointer bg-card hover:shadow-xl hover:shadow-purple-500/5"
        onClick={handleCardClick}
      >
        {/* Top accent line */}
        <div className="h-[2px] gradient-cool" />

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-mcp-blue-500/10 flex items-center justify-center">
                <Server className="h-5 w-5 text-mcp-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">{server.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
              <span className={`text-xs font-medium ${status.textColor}`}>{status.text}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {server.description}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Wrench className="h-4 w-4 text-mcp-orange-400" />
              <span className="font-medium">{server.tools.length} Tools</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono truncate max-w-[180px]">
              <Plug className="h-4 w-4 shrink-0 text-mcp-teal-400" />
              <span className="truncate">{server.connection_url}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 px-6 py-3 border-t border-border/50 flex justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {lastUpdated}</span>
          </div>

          {server.status === 'connected' ? (
            <Badge className="text-xs border-0 gap-1 gradient-success text-white shadow-sm">
              <PlugZap className="h-3 w-3" />
              Live
            </Badge>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-mcp-purple-500/30 text-mcp-purple-400 hover:bg-mcp-purple-500/10 hover:text-mcp-purple-300"
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
    </div>
  );
};

export default ServerCard;
