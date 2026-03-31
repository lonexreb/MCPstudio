export type ExecutionStatus = 'pending' | 'running' | 'success' | 'error';

export interface ExecutionRecord {
  id?: number;
  serverId: string;
  serverName: string;
  toolId: string;
  toolName: string;
  parameters: Record<string, any>;
  result: Record<string, any> | null;
  status: 'success' | 'error';
  executionTime: number;
  timestamp: Date;
}
