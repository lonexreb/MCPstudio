import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '@/lib/api/resources';

export function useResources(serverId: string | undefined) {
  return useQuery({
    queryKey: ['resources', serverId],
    queryFn: () => resourcesApi.listForServer(serverId!),
    enabled: !!serverId,
    select: (data) => data.resources,
  });
}
