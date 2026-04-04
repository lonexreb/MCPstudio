import { useQuery } from '@tanstack/react-query';
import { discoveryApi } from '@/lib/api/discovery';

export function useDiscoverySearch(params: {
  query: string;
  source: string;
  page: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['discovery', params],
    queryFn: () =>
      discoveryApi.search({
        query: params.query,
        source: params.source,
        page: params.page,
        limit: params.limit || 20,
      }),
    enabled: !!params.query,
    staleTime: 60_000, // Cache for 1 minute
  });
}
