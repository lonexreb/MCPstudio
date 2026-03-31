import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/features/execution/lib/db';
import type { ExecutionRecord } from '@/features/execution/types/execution';

export function useExecutionHistory(serverId?: string, limit = 50) {
  return useLiveQuery(
    () => {
      let query = db.executions.orderBy('timestamp').reverse();
      if (serverId) {
        query = db.executions.where('serverId').equals(serverId).reverse();
      }
      return query.limit(limit).toArray();
    },
    [serverId, limit],
  );
}

export function useExecutionHistoryForTool(serverId: string, toolId: string, limit = 20) {
  return useLiveQuery(
    () =>
      db.executions
        .where('[serverId+toolId]')
        .equals([serverId, toolId])
        .reverse()
        .limit(limit)
        .toArray()
        .catch(() =>
          db.executions
            .where('serverId')
            .equals(serverId)
            .filter((r) => r.toolId === toolId)
            .reverse()
            .sortBy('timestamp')
            .then((arr) => arr.slice(0, limit)),
        ),
    [serverId, toolId, limit],
  );
}

export async function saveExecution(record: Omit<ExecutionRecord, 'id'>) {
  return db.executions.add(record);
}

export async function clearExecutionHistory() {
  return db.executions.clear();
}
