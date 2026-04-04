import { Link } from 'react-router-dom';
import { Wrench, Server, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ToolWithServerResponse } from '@/types/api';

interface ToolCardProps {
  tool: ToolWithServerResponse;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const paramCount = tool.parameters?.properties
    ? Object.keys(tool.parameters.properties).length
    : 0;

  return (
    <Link
      to={`/server/${tool.server_id}`}
      className="group relative block"
    >
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-mcp-orange-500 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-[1px]" />
      <div className="relative p-4 rounded-xl bg-card border border-border/50 hover:border-transparent transition-all space-y-3">
        <div className="flex items-start justify-between">
          <div className="h-9 w-9 rounded-lg bg-mcp-orange-500/10 flex items-center justify-center">
            <Wrench className="h-4 w-4 text-mcp-orange-400" />
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div>
          <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {tool.description || 'No description'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0">
            <Server className="h-3 w-3" />
            {tool.server_name}
          </Badge>
          {paramCount > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {paramCount} param{paramCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
