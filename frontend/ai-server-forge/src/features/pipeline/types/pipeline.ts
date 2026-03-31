export type PipelineNodeStatus = 'idle' | 'pending' | 'running' | 'success' | 'error' | 'skipped';
export type PipelineNodeType = 'tool' | 'input' | 'output';

export interface ToolNodeData {
  type: 'tool';
  serverId: string;
  serverName: string;
  toolId: string;
  toolName: string;
  description: string;
  parameters: Record<string, any>;
  parameterValues: Record<string, any>;
  parameterMappings: Record<string, string>;
  status: PipelineNodeStatus;
  result: Record<string, any> | null;
  error: string | null;
  executionTime: number | null;
}

export interface InputNodeData {
  type: 'input';
  fields: Array<{ key: string; type: string; defaultValue?: any }>;
  values: Record<string, any>;
  status: PipelineNodeStatus;
}

export interface OutputNodeData {
  type: 'output';
  mappings: Record<string, string>;
  result: Record<string, any> | null;
  status: PipelineNodeStatus;
}

export type PipelineNodeData = ToolNodeData | InputNodeData | OutputNodeData;

export interface SerializedNode {
  id: string;
  type: PipelineNodeType;
  position: { x: number; y: number };
  data: PipelineNodeData;
}

export interface SerializedEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
}

export interface PipelineRecord {
  id?: number;
  name: string;
  description: string;
  nodes: SerializedNode[];
  edges: SerializedEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineExecutionRecord {
  id?: number;
  pipelineId: number;
  pipelineName: string;
  status: 'success' | 'error' | 'partial';
  nodeResults: Record<string, { status: string; result: any; executionTime: number }>;
  totalExecutionTime: number;
  timestamp: Date;
}
