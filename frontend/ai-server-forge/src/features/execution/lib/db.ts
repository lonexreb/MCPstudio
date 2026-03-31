import Dexie, { type Table } from 'dexie';
import type { ExecutionRecord } from '@/features/execution/types/execution';

class MCPStudioDB extends Dexie {
  executions!: Table<ExecutionRecord>;

  constructor() {
    super('mcpstudio');
    this.version(1).stores({
      executions: '++id, serverId, toolId, timestamp',
    });
  }
}

export const db = new MCPStudioDB();
