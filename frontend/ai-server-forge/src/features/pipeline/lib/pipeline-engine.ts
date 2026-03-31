import type { SerializedNode, SerializedEdge, PipelineNodeStatus } from '../types/pipeline';
import { toolsApi } from '@/lib/api/tools';
import { saveExecution } from '@/features/execution/hooks/use-execution-history';

export function topologicalSort(
  nodes: SerializedNode[],
  edges: SerializedEdge[],
): string[] | null {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    adjacency.get(edge.source)?.push(edge.target);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    sorted.push(id);
    for (const neighbor of adjacency.get(id) || []) {
      const newDeg = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  return sorted.length === nodes.length ? sorted : null;
}

export function validateDAG(
  nodes: SerializedNode[],
  edges: SerializedEdge[],
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (nodes.length === 0) {
    errors.push('Pipeline has no nodes');
    return { valid: false, errors };
  }

  const toolNodes = nodes.filter((n) => n.type === 'tool');
  if (toolNodes.length === 0) {
    errors.push('Pipeline has no tool nodes');
  }

  for (const node of toolNodes) {
    if (node.data.type === 'tool') {
      if (!node.data.serverId) errors.push(`Tool node "${node.data.toolName || node.id}" has no server configured`);
      if (!node.data.toolId) errors.push(`Tool node "${node.data.toolName || node.id}" has no tool configured`);
    }
  }

  const nodeIds = new Set(nodes.map((n) => n.id));
  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) errors.push(`Edge references non-existent source node: ${edge.source}`);
    if (!nodeIds.has(edge.target)) errors.push(`Edge references non-existent target node: ${edge.target}`);
  }

  if (topologicalSort(nodes, edges) === null) {
    errors.push('Pipeline contains a cycle. Remove circular connections before running.');
  }

  return { valid: errors.length === 0, errors };
}

export function resolveValue(
  path: string,
  nodeResults: Map<string, any>,
): any {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  const nodeId = parts[0];

  let current = nodeResults.get(nodeId);
  if (current === undefined) return undefined;

  for (let i = 1; i < parts.length; i++) {
    if (current == null) return undefined;
    const key = parts[i];
    current = /^\d+$/.test(key) ? current[Number(key)] : current[key];
  }

  return current;
}

function getDescendants(nodeId: string, edges: SerializedEdge[]): string[] {
  const visited = new Set<string>();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const edge of edges) {
      if (edge.source === current && !visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push(edge.target);
      }
    }
  }
  return Array.from(visited);
}

type StatusCallback = (
  nodeId: string,
  status: PipelineNodeStatus,
  result?: any,
  error?: string,
  time?: number,
) => void;

export async function executePipeline(
  nodes: SerializedNode[],
  edges: SerializedEdge[],
  onStatusChange: StatusCallback,
): Promise<{ success: boolean; nodeResults: Record<string, any>; totalTime: number }> {
  const validation = validateDAG(nodes, edges);
  if (!validation.valid) {
    throw new Error(validation.errors.join('\n'));
  }

  const sortedIds = topologicalSort(nodes, edges);
  if (!sortedIds) throw new Error('Pipeline contains a cycle');

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const nodeResults = new Map<string, any>();
  const totalStart = Date.now();

  for (const id of sortedIds) {
    onStatusChange(id, 'pending');
  }

  for (const id of sortedIds) {
    const node = nodeMap.get(id)!;

    if (node.data.type === 'input') {
      nodeResults.set(id, node.data.values);
      onStatusChange(id, 'success', node.data.values);
      continue;
    }

    if (node.data.type === 'output') {
      const resolved: Record<string, any> = {};
      for (const [key, path] of Object.entries(node.data.mappings)) {
        resolved[key] = resolveValue(path, nodeResults);
      }
      nodeResults.set(id, resolved);
      onStatusChange(id, 'success', resolved);
      continue;
    }

    // Tool node
    onStatusChange(id, 'running');
    const startTime = Date.now();
    const data = node.data;

    const resolvedParams: Record<string, any> = { ...data.parameterValues };
    for (const [paramKey, mappingPath] of Object.entries(data.parameterMappings)) {
      const val = resolveValue(mappingPath, nodeResults);
      if (val !== undefined) resolvedParams[paramKey] = val;
    }

    try {
      const result = await toolsApi.execute(data.serverId, data.toolId, { parameters: resolvedParams });
      const elapsed = Date.now() - startTime;

      nodeResults.set(id, result.result);

      await saveExecution({
        serverId: data.serverId,
        serverName: data.serverName,
        toolId: data.toolId,
        toolName: data.toolName,
        parameters: resolvedParams,
        result: result.result,
        status: result.status,
        executionTime: result.execution_time || elapsed,
        timestamp: new Date(),
      }).catch(() => {});

      onStatusChange(id, 'success', result.result, undefined, elapsed);
    } catch (err: any) {
      const elapsed = Date.now() - startTime;

      await saveExecution({
        serverId: data.serverId,
        serverName: data.serverName,
        toolId: data.toolId,
        toolName: data.toolName,
        parameters: resolvedParams,
        result: { error: err.message },
        status: 'error',
        executionTime: elapsed,
        timestamp: new Date(),
      }).catch(() => {});

      onStatusChange(id, 'error', undefined, err.message, elapsed);

      for (const descendant of getDescendants(id, edges)) {
        onStatusChange(descendant, 'skipped');
      }

      return {
        success: false,
        nodeResults: Object.fromEntries(nodeResults),
        totalTime: Date.now() - totalStart,
      };
    }
  }

  return {
    success: true,
    nodeResults: Object.fromEntries(nodeResults),
    totalTime: Date.now() - totalStart,
  };
}
