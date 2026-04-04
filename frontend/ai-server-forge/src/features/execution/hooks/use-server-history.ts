import { useQuery } from '@tanstack/react-query';
import { executionsApi } from '@/lib/api/executions';

export function useServerExecutionHistory(params?: {
  server_id?: string;
  tool_id?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['server-executions', params],
    queryFn: () => executionsApi.list(params),
  });
}
