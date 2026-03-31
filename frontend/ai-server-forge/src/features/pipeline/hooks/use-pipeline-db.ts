import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/features/execution/lib/db';
import type { PipelineRecord, PipelineExecutionRecord } from '../types/pipeline';

export function usePipelines(limit = 50) {
  return useLiveQuery(() =>
    db.pipelines.orderBy('updatedAt').reverse().limit(limit).toArray(),
  );
}

export function usePipeline(id: number | undefined) {
  return useLiveQuery(
    () => (id ? db.pipelines.get(id) : undefined),
    [id],
  );
}

export function usePipelineExecutions(pipelineId: number | undefined, limit = 20) {
  return useLiveQuery(
    () =>
      pipelineId
        ? db.pipelineExecutions
            .where('pipelineId')
            .equals(pipelineId)
            .reverse()
            .limit(limit)
            .toArray()
        : [],
    [pipelineId, limit],
  );
}

export async function savePipeline(record: Omit<PipelineRecord, 'id'>): Promise<number> {
  return db.pipelines.add(record);
}

export async function updatePipeline(id: number, updates: Partial<PipelineRecord>): Promise<void> {
  await db.pipelines.update(id, updates);
}

export async function deletePipeline(id: number): Promise<void> {
  await db.pipelines.delete(id);
  await db.pipelineExecutions.where('pipelineId').equals(id).delete();
}

export async function savePipelineExecution(
  record: Omit<PipelineExecutionRecord, 'id'>,
): Promise<number> {
  return db.pipelineExecutions.add(record);
}
