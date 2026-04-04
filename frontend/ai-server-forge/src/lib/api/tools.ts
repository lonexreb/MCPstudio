import { api } from './client';
import type {
  ToolResponse,
  ToolListResponse,
  AllToolsListResponse,
  ToolExecutionRequest,
  ToolExecutionResponse,
} from '@/types/api';

export const toolsApi = {
  listAll: () =>
    api.get<AllToolsListResponse>('/api/tools'),

  listForServer: (serverId: string) =>
    api.get<ToolListResponse>(`/api/servers/${serverId}/tools`),

  get: (toolId: string) =>
    api.get<ToolResponse>(`/api/tools/${toolId}`),

  execute: (serverId: string, toolId: string, params: ToolExecutionRequest) =>
    api.post<ToolExecutionResponse>(
      `/api/servers/${serverId}/tools/${toolId}/execute`,
      params,
    ),
};
