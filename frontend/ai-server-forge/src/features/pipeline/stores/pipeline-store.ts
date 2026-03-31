import { create } from 'zustand';
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { PipelineNodeData, PipelineNodeStatus } from '../types/pipeline';

interface PipelineEditorState {
  pipelineId: number | null;
  pipelineName: string;
  pipelineDescription: string;
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  isExecuting: boolean;
  isDirty: boolean;

  setPipelineId: (id: number | null) => void;
  setPipelineMeta: (name: string, description: string) => void;
  setNodes: (nodes: Node<PipelineNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<PipelineNodeData>) => void;
  updateNodeData: (nodeId: string, data: Partial<PipelineNodeData>) => void;
  setNodeStatus: (nodeId: string, status: PipelineNodeStatus, result?: any, error?: string, time?: number) => void;
  selectNode: (nodeId: string | null) => void;
  removeSelectedNode: () => void;
  setIsExecuting: (executing: boolean) => void;
  resetExecution: () => void;
  loadPipeline: (id: number | null, name: string, desc: string, nodes: Node<PipelineNodeData>[], edges: Edge[]) => void;
  reset: () => void;
}

export const usePipelineStore = create<PipelineEditorState>()((set, get) => ({
  pipelineId: null,
  pipelineName: 'Untitled Pipeline',
  pipelineDescription: '',
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isExecuting: false,
  isDirty: false,

  setPipelineId: (id) => set({ pipelineId: id }),
  setPipelineMeta: (name, description) => set({ pipelineName: name, pipelineDescription: description, isDirty: true }),

  setNodes: (nodes) => set({ nodes, isDirty: true }),
  setEdges: (edges) => set({ edges, isDirty: true }),

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) as Node<PipelineNodeData>[], isDirty: true })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges), isDirty: true })),

  onConnect: (connection) =>
    set((state) => ({ edges: addEdge(connection, state.edges), isDirty: true })),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node], isDirty: true })),

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } as PipelineNodeData } : n,
      ),
      isDirty: true,
    })),

  setNodeStatus: (nodeId, status, result, error, time) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                status,
                ...(result !== undefined && { result }),
                ...(error !== undefined && { error }),
                ...(time !== undefined && { executionTime: time }),
              } as PipelineNodeData,
            }
          : n,
      ),
    })),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  removeSelectedNode: () => {
    const { selectedNodeId, nodes, edges } = get();
    if (!selectedNodeId) return;
    set({
      nodes: nodes.filter((n) => n.id !== selectedNodeId),
      edges: edges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
      selectedNodeId: null,
      isDirty: true,
    });
  },

  setIsExecuting: (executing) => set({ isExecuting: executing }),

  resetExecution: () =>
    set((state) => ({
      nodes: state.nodes.map((n) => ({
        ...n,
        data: { ...n.data, status: 'idle', result: null, error: null, executionTime: null } as PipelineNodeData,
      })),
    })),

  loadPipeline: (id, name, desc, nodes, edges) =>
    set({ pipelineId: id, pipelineName: name, pipelineDescription: desc, nodes, edges, isDirty: false, selectedNodeId: null }),

  reset: () =>
    set({
      pipelineId: null,
      pipelineName: 'Untitled Pipeline',
      pipelineDescription: '',
      nodes: [],
      edges: [],
      selectedNodeId: null,
      isExecuting: false,
      isDirty: false,
    }),
}));
