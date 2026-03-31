import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Play, LayoutGrid, Download, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePipelineStore } from '../stores/pipeline-store';
import { savePipeline, updatePipeline, deletePipeline, savePipelineExecution } from '../hooks/use-pipeline-db';
import { executePipeline, validateDAG } from '../lib/pipeline-engine';
import { getLayoutedElements } from '../lib/auto-layout';
import type { SerializedNode, SerializedEdge } from '../types/pipeline';

const PipelineToolbar = () => {
  const navigate = useNavigate();
  const store = usePipelineStore();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const nodes: SerializedNode[] = store.nodes.map((n) => ({
        id: n.id,
        type: n.type as any,
        position: n.position,
        data: n.data,
      }));
      const edges: SerializedEdge[] = store.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle || null,
        targetHandle: e.targetHandle || null,
      }));

      if (store.pipelineId) {
        await updatePipeline(store.pipelineId, {
          name: store.pipelineName,
          description: store.pipelineDescription,
          nodes,
          edges,
          updatedAt: new Date(),
        });
        toast.success('Pipeline saved');
      } else {
        const id = await savePipeline({
          name: store.pipelineName,
          description: store.pipelineDescription,
          nodes,
          edges,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        store.setPipelineId(id);
        toast.success('Pipeline created');
        navigate(`/pipelines/${id}`, { replace: true });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleRun = async () => {
    const nodes: SerializedNode[] = store.nodes.map((n) => ({
      id: n.id,
      type: n.type as any,
      position: n.position,
      data: n.data,
    }));
    const edges: SerializedEdge[] = store.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle || null,
      targetHandle: e.targetHandle || null,
    }));

    const validation = validateDAG(nodes, edges);
    if (!validation.valid) {
      toast.error(validation.errors.join('\n'));
      return;
    }

    store.resetExecution();
    store.setIsExecuting(true);

    try {
      const result = await executePipeline(nodes, edges, (nodeId, status, res, err, time) => {
        store.setNodeStatus(nodeId, status, res, err, time);
      });

      if (store.pipelineId) {
        await savePipelineExecution({
          pipelineId: store.pipelineId,
          pipelineName: store.pipelineName,
          status: result.success ? 'success' : 'error',
          nodeResults: result.nodeResults,
          totalExecutionTime: result.totalTime,
          timestamp: new Date(),
        }).catch(() => {});
      }

      toast[result.success ? 'success' : 'error'](
        `Pipeline ${result.success ? 'completed' : 'failed'} in ${result.totalTime}ms`,
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      store.setIsExecuting(false);
    }
  };

  const handleAutoLayout = () => {
    const { nodes, edges } = getLayoutedElements(store.nodes, store.edges, 'LR');
    store.setNodes(nodes as any);
    store.setEdges(edges);
    toast.success('Layout applied');
  };

  const handleExport = () => {
    const data = {
      name: store.pipelineName,
      description: store.pipelineDescription,
      nodes: store.nodes.map((n) => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
      edges: store.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${store.pipelineName.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!store.pipelineId) {
      navigate('/pipelines');
      return;
    }
    if (!confirm('Delete this pipeline?')) return;
    await deletePipeline(store.pipelineId);
    toast.success('Pipeline deleted');
    navigate('/pipelines');
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b bg-card shrink-0">
      <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate('/pipelines')}>
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Input
        value={store.pipelineName}
        onChange={(e) => store.setPipelineMeta(e.target.value, store.pipelineDescription)}
        className="h-8 w-52 text-sm font-medium border-none bg-transparent focus-visible:ring-1"
        placeholder="Pipeline name"
      />

      <div className="flex-1" />

      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleAutoLayout} disabled={store.isExecuting}>
        <LayoutGrid className="h-3.5 w-3.5 mr-1" />
        Layout
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleExport}>
        <Download className="h-3.5 w-3.5 mr-1" />
        Export
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleSave} disabled={saving || store.isExecuting}>
        {saving ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
        Save
      </Button>
      <Button size="sm" className="h-8 text-xs" onClick={handleRun} disabled={store.isExecuting || store.nodes.length === 0}>
        {store.isExecuting ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Play className="h-3.5 w-3.5 mr-1" />}
        {store.isExecuting ? 'Running...' : 'Run'}
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive" onClick={handleDelete}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default PipelineToolbar;
