import { create } from 'zustand';
import type { ExecutionStatus } from '@/features/execution/types/execution';

interface ExecutionState {
  selectedServerId: string | null;
  selectedToolId: string | null;
  selectedToolName: string | null;
  status: ExecutionStatus;
  setSelectedTool: (serverId: string, toolId: string, toolName: string) => void;
  setStatus: (status: ExecutionStatus) => void;
  clear: () => void;
}

export const useExecutionStore = create<ExecutionState>()((set) => ({
  selectedServerId: null,
  selectedToolId: null,
  selectedToolName: null,
  status: 'pending',
  setSelectedTool: (serverId, toolId, toolName) =>
    set({ selectedServerId: serverId, selectedToolId: toolId, selectedToolName: toolName, status: 'pending' }),
  setStatus: (status) => set({ status }),
  clear: () =>
    set({ selectedServerId: null, selectedToolId: null, selectedToolName: null, status: 'pending' }),
}));
