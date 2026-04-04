import { api } from './client';

export interface ResourceItem {
  uri: string;
  name: string;
  description?: string;
  mime_type?: string;
}

export interface ResourceListResponse {
  resources: ResourceItem[];
  server_id: string;
}

export const resourcesApi = {
  listForServer: (serverId: string) =>
    api.get<ResourceListResponse>(`/api/servers/${serverId}/resources`),
};
