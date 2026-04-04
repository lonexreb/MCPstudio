import { useState, useEffect } from 'react';
import { Compass, Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDiscoveryStore } from '../stores/discovery-store';
import { useDiscoverySearch } from '../hooks/use-discovery';
import DiscoveryCard from '../components/DiscoveryCard';

const sources = [
  { value: 'all', label: 'All' },
  { value: 'npm', label: 'npm' },
  { value: 'github', label: 'GitHub' },
];

const DiscoveryPage = () => {
  const { searchQuery, selectedSource, page, setSearchQuery, setSelectedSource, setPage } = useDiscoveryStore();
  const [inputValue, setInputValue] = useState(searchQuery);

  const { data, isLoading, error } = useDiscoverySearch({
    query: searchQuery,
    source: selectedSource,
    page,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, setSearchQuery]);

  return (
    <MainLayout title="Discover" subtitle="Find MCP servers from public registries">
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl p-6 gradient-aurora shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Discover MCP Servers</h2>
              <p className="text-white/70 text-sm">
                Search npm and GitHub for MCP-compatible servers
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search MCP servers..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1.5">
            {sources.map((src) => (
              <Badge
                key={src.value}
                variant={selectedSource === src.value ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1.5 text-xs"
                onClick={() => setSelectedSource(src.value)}
              >
                {src.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="border border-red-500/30 rounded-xl p-8 text-center bg-red-500/5">
            <h3 className="text-lg font-medium mb-2 text-red-400">Search failed</h3>
            <p className="text-sm text-muted-foreground">
              Could not reach the registry. Check your internet connection.
            </p>
          </div>
        ) : data && data.servers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.servers.map((server) => (
                <DiscoveryCard key={`${server.source}-${server.package_name}`} server={server} />
              ))}
            </div>

            {data.total > 20 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="border border-border/50 rounded-xl p-12 text-center">
            <Compass className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No servers found</h3>
            <p className="text-sm text-muted-foreground">
              Try a different search query or source filter.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DiscoveryPage;
