import { FileText, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ResourceItem } from '@/lib/api/resources';

interface ResourceCardProps {
  resource: ResourceItem;
  serverName?: string;
}

const ResourceCard = ({ resource, serverName }: ResourceCardProps) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-mcp-teal-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-[1px]" />
      <div className="relative p-4 rounded-xl bg-card border border-border/50 hover:border-transparent transition-all space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-mcp-teal-500/10 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4 text-mcp-teal-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">{resource.name}</h3>
            <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">{resource.uri}</p>
          </div>
        </div>

        {resource.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {resource.mime_type && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {resource.mime_type}
            </Badge>
          )}
          {serverName && (
            <Badge variant="secondary" className="text-[10px] gap-1 px-1.5 py-0">
              <Globe className="h-3 w-3" />
              {serverName}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
