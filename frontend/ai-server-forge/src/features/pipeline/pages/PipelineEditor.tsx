import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import Sidebar from '@/components/layout/Sidebar';
import PipelineToolbar from '../components/PipelineToolbar';
import PipelineSidebar from '../components/PipelineSidebar';
import PipelineCanvas from '../components/PipelineCanvas';
import PipelineNodePanel from '../components/PipelineNodePanel';
import { usePipelineStore } from '../stores/pipeline-store';
import { usePipeline } from '../hooks/use-pipeline-db';
import type { PipelineNodeData, InputNodeData, OutputNodeData } from '../types/pipeline';
import type { Node } from '@xyflow/react';

const PipelineEditor = () => {
  const { id } = useParams<{ id: string }>();
  const store = usePipelineStore();
  const pipeline = usePipeline(id ? Number(id) : undefined);

  // Load existing pipeline or initialize new one
  useEffect(() => {
    if (id && pipeline) {
      store.loadPipeline(
        pipeline.id!,
        pipeline.name,
        pipeline.description,
        pipeline.nodes as Node<PipelineNodeData>[],
        pipeline.edges,
      );
    } else if (!id && store.pipelineId !== null) {
      // New pipeline — initialize with Input + Output nodes
      store.reset();
      const inputNode: Node<PipelineNodeData> = {
        id: 'input-1',
        type: 'input',
        position: { x: 50, y: 200 },
        data: { type: 'input', fields: [], values: {}, status: 'idle' } as InputNodeData,
      };
      const outputNode: Node<PipelineNodeData> = {
        id: 'output-1',
        type: 'output',
        position: { x: 700, y: 200 },
        data: { type: 'output', mappings: {}, result: null, status: 'idle' } as OutputNodeData,
      };
      store.setNodes([inputNode, outputNode]);
    } else if (!id && store.nodes.length === 0) {
      // First mount of new pipeline
      const inputNode: Node<PipelineNodeData> = {
        id: 'input-1',
        type: 'input',
        position: { x: 50, y: 200 },
        data: { type: 'input', fields: [], values: {}, status: 'idle' } as InputNodeData,
      };
      const outputNode: Node<PipelineNodeData> = {
        id: 'output-1',
        type: 'output',
        position: { x: 700, y: 200 },
        data: { type: 'output', mappings: {}, result: null, status: 'idle' } as OutputNodeData,
      };
      store.setNodes([inputNode, outputNode]);
    }
  }, [id, pipeline]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      store.reset();
    };
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar activePath="/pipelines" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PipelineToolbar />
        <ReactFlowProvider>
          <div className="flex-1 flex overflow-hidden">
            <PipelineSidebar />
            <PipelineCanvas />
            {store.selectedNodeId && <PipelineNodePanel />}
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default PipelineEditor;
