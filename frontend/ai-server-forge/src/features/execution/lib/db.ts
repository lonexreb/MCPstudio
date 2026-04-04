import Dexie, { type Table } from 'dexie';
import type { ExecutionRecord } from '@/features/execution/types/execution';
import type { PipelineRecord, PipelineExecutionRecord } from '@/features/pipeline/types/pipeline';
import type { PromptTemplate } from '@/features/prompts/types/prompt';

class MCPStudioDB extends Dexie {
  executions!: Table<ExecutionRecord>;
  pipelines!: Table<PipelineRecord>;
  pipelineExecutions!: Table<PipelineExecutionRecord>;
  prompts!: Table<PromptTemplate>;

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

    this.version(3).stores({
      executions: '++id, serverId, toolId, timestamp',
      pipelines: '++id, name, updatedAt',
      pipelineExecutions: '++id, pipelineId, timestamp',
      prompts: '++id, name, *tags, serverId, updatedAt',
    });
  }
}

export const db = new MCPStudioDB();
