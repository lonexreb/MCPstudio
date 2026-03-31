import { api } from './client';
import type {
  ServerCreate,
  ServerUpdate,
  ServerResponse,
  ServerListResponse,
} from '@/types/api';

export const serversApi = {
  list: () =>
    api.get<ServerListResponse>('/api/servers'),

  get: (id: string) =>
    api.get<ServerResponse>(`/api/servers/${id}`),

  create: (data: ServerCreate) =>
    api.post<ServerResponse>('/api/servers', data),

  update: (id: string, data: ServerUpdate) =>
    api.put<ServerResponse>(`/api/servers/${id}`, data),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/servers/${id}`),

  connect: (id: string) =>
    api.post<ServerResponse>(`/api/servers/${id}/connect`),

  disconnect: (id: string) =>
    api.post<ServerResponse>(`/api/servers/${id}/disconnect`),
};
