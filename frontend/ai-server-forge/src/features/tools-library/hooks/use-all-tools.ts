import { useQuery } from '@tanstack/react-query';
import { toolsApi } from '@/lib/api/tools';

export function useAllTools() {
  return useQuery({
    queryKey: ['all-tools'],
    queryFn: () => toolsApi.listAll(),
    select: (data) => data.tools,
  });
}
