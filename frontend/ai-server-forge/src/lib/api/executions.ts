import { api } from './client';

export interface ExecutionResultResponse {
  id: string;
  server_id: string;
  server_name: string;
  tool_id: string;
  tool_name: string;
  parameters: Record<string, any>;
  result: Record<string, any>;
  status: string;
  execution_time: number;
  error_message?: string;
  created_at: string;
}

export interface ExecutionHistoryResponse {
  executions: ExecutionResultResponse[];
  total: number;
}

export const executionsApi = {
  list: (params?: { server_id?: string; tool_id?: string; limit?: number; offset?: number }) => {
    const query = new URLSearchParams();
    if (params?.server_id) query.set('server_id', params.server_id);
    if (params?.tool_id) query.set('tool_id', params.tool_id);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    const qs = query.toString();
    return api.get<ExecutionHistoryResponse>(`/api/executions${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) =>
    api.get<ExecutionResultResponse>(`/api/executions/${id}`),

  clear: (serverId?: string) => {
    const qs = serverId ? `?server_id=${serverId}` : '';
    return api.delete<void>(`/api/executions${qs}`);
  },
};
