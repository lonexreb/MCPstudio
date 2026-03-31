import Dexie, { type Table } from 'dexie';
import type { ExecutionRecord } from '@/features/execution/types/execution';
import type { PipelineRecord, PipelineExecutionRecord } from '@/features/pipeline/types/pipeline';

class MCPStudioDB extends Dexie {
  executions!: Table<ExecutionRecord>;
  pipelines!: Table<PipelineRecord>;
  pipelineExecutions!: Table<PipelineExecutionRecord>;

  constructor() {
    super('mcpstudio');

    this.version(1).stores({
      executions: '++id, serverId, toolId, timestamp',
    });

    this.version(2).stores({
      executions: '++id, serverId, toolId, timestamp',
      pipelines: '++id, name, updatedAt',
      pipelineExecutions: '++id, pipelineId, timestamp',
    });
  }
}

export const db = new MCPStudioDB();
