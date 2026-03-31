import { useQuery, useMutation } from '@tanstack/react-query';
import { toolsApi } from '@/lib/api/tools';
import type { ToolExecutionRequest } from '@/types/api';

export function useTools(serverId: string | undefined) {
  return useQuery({
    queryKey: ['tools', serverId],
    queryFn: () => toolsApi.listForServer(serverId!),
    select: (data) => data.tools,
    enabled: !!serverId,
  });
}

export function useTool(toolId: string | undefined) {
  return useQuery({
    queryKey: ['tool', toolId],
    queryFn: () => toolsApi.get(toolId!),
    enabled: !!toolId,
  });
}

export function useExecuteTool() {
  return useMutation({
    mutationFn: ({
      serverId,
      toolId,
      params,
    }: {
      serverId: string;
      toolId: string;
      params: ToolExecutionRequest;
    }) => toolsApi.execute(serverId, toolId, params),
  });
}
