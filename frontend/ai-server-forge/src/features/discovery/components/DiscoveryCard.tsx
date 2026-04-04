import { Star, ExternalLink, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DiscoveredServer } from '@/lib/api/discovery';

interface DiscoveryCardProps {
  server: DiscoveredServer;
}

const sourceColors: Record<string, string> = {
  npm: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  github: 'bg-muted text-muted-foreground border-border',
};

const DiscoveryCard = ({ server }: DiscoveryCardProps) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-mcp-cyan-500 to-mcp-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-[1px]" />
      <div className="relative p-4 rounded-xl bg-card border border-border/50 hover:border-transparent transition-all space-y-3 h-full flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{server.display_name}</h3>
            {server.author && (
              <p className="text-xs text-muted-foreground">by {server.author}</p>
            )}
          </div>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${sourceColors[server.source] || ''}`}>
            {server.source}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
          {server.description || 'No description'}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {server.stars > 0 && (
            <span className="flex items-center gap-1 text-xs text-yellow-400">
              <Star className="h-3 w-3" />
              {typeof server.stars === 'number' && server.stars < 1
                ? (server.stars * 100).toFixed(0) + '%'
                : server.stars}
            </span>
          )}
          {server.version && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              v{server.version}
            </Badge>
          )}
          {server.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          {server.homepage_url && (
            <a
              href={server.homepage_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" size="sm" className="w-full text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Button>
            </a>
          )}
          {server.install_command && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => navigator.clipboard.writeText(server.install_command)}
            >
              <Terminal className="h-3 w-3 mr-1" />
              Copy Install
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryCard;
