import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './nodes';
import { usePipelineStore } from '../stores/pipeline-store';
import type { ToolNodeData, PipelineNodeData } from '../types/pipeline';
import type { Node } from '@xyflow/react';

const PipelineCanvas = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
  } = usePipelineStore();

  const reactFlowRef = useRef<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      try {
        const { type, serverId, serverName, tool } = JSON.parse(raw);
        if (type !== 'tool' || !reactFlowRef.current) return;

        const position = reactFlowRef.current.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: Node<PipelineNodeData> = {
          id: `tool-${crypto.randomUUID().slice(0, 8)}`,
          type: 'tool',
          position,
          data: {
            type: 'tool',
            serverId,
            serverName,
            toolId: tool.id,
            toolName: tool.name,
            description: tool.description,
            parameters: tool.parameters || {},
            parameterValues: {},
            parameterMappings: {},
            status: 'idle',
            result: null,
            error: null,
            executionTime: null,
          } as ToolNodeData,
        };

        addNode(newNode);
      } catch {
        // Invalid drag data
      }
    },
    [addNode],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => { reactFlowRef.current = instance; }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        defaultEdgeOptions={{ animated: true }}
      >
        <Background gap={16} size={1} />
        <Controls className="!bg-card !border-border !shadow-sm" />
        <MiniMap
          className="!bg-card !border-border"
          nodeColor={(node) => {
            const data = node.data as PipelineNodeData;
            if (data.status === 'success') return '#22c55e';
            if (data.status === 'error') return '#ef4444';
            if (data.status === 'running') return '#3b82f6';
            if (data.type === 'input') return '#22c55e';
            if (data.type === 'output') return '#3b82f6';
            return '#6b7280';
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default PipelineCanvas;
