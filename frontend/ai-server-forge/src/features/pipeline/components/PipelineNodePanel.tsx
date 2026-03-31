import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { usePipelineStore } from '../stores/pipeline-store';
import type { ToolNodeData, InputNodeData, OutputNodeData } from '../types/pipeline';

function ToolNodeConfig({ data, nodeId }: { data: ToolNodeData; nodeId: string }) {
  const { updateNodeData } = usePipelineStore();

  const handleParamChange = (key: string, value: any) => {
    updateNodeData(nodeId, {
      parameterValues: { ...data.parameterValues, [key]: value },
    } as Partial<ToolNodeData>);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground">Server</p>
        <p className="text-sm">{data.serverName}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Description</p>
        <p className="text-sm">{data.description}</p>
      </div>
      <Separator />
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Parameters</p>
        {Object.entries(data.parameters).length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No parameters</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(data.parameters).map(([key, schema]) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{key}</Label>
                {data.parameterMappings[key] ? (
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-[10px]">Mapped</Badge>
                    <span className="text-[10px] text-muted-foreground font-mono truncate">
                      {data.parameterMappings[key]}
                    </span>
                  </div>
                ) : (
                  <Input
                    className="h-7 text-xs"
                    value={data.parameterValues[key] ?? ''}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    placeholder={typeof schema === 'object' ? schema.description : `Enter ${key}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {data.result && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Result</p>
            <pre className="bg-muted rounded p-2 text-[10px] max-h-32 overflow-auto">
              {JSON.stringify(data.result, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

function InputNodeConfig({ data, nodeId }: { data: InputNodeData; nodeId: string }) {
  const { updateNodeData } = usePipelineStore();

  const addField = () => {
    const fields = [...data.fields, { key: `field_${data.fields.length + 1}`, type: 'string' }];
    updateNodeData(nodeId, { fields } as Partial<InputNodeData>);
  };

  const updateField = (index: number, key: string, value: string) => {
    const fields = [...data.fields];
    fields[index] = { ...fields[index], [key]: value };
    updateNodeData(nodeId, { fields } as Partial<InputNodeData>);
  };

  const updateValue = (key: string, value: string) => {
    updateNodeData(nodeId, { values: { ...data.values, [key]: value } } as Partial<InputNodeData>);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Input Fields</p>
        <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={addField}>
          + Add Field
        </Button>
      </div>
      {data.fields.map((field, i) => (
        <div key={i} className="space-y-1.5 border rounded p-2">
          <div className="flex gap-2">
            <Input
              className="h-7 text-xs"
              value={field.key}
              onChange={(e) => updateField(i, 'key', e.target.value)}
              placeholder="Field name"
            />
            <Input
              className="h-7 text-xs w-20"
              value={field.type}
              onChange={(e) => updateField(i, 'type', e.target.value)}
              placeholder="Type"
            />
          </div>
          <Input
            className="h-7 text-xs"
            value={data.values[field.key] ?? ''}
            onChange={(e) => updateValue(field.key, e.target.value)}
            placeholder={`Default value for ${field.key}`}
          />
        </div>
      ))}
    </div>
  );
}

function OutputNodeConfig({ data, nodeId }: { data: OutputNodeData; nodeId: string }) {
  const { updateNodeData } = usePipelineStore();

  const addMapping = () => {
    const key = `output_${Object.keys(data.mappings).length + 1}`;
    updateNodeData(nodeId, { mappings: { ...data.mappings, [key]: '' } } as Partial<OutputNodeData>);
  };

  const updateMapping = (oldKey: string, newKey: string, path: string) => {
    const newMappings = { ...data.mappings };
    if (oldKey !== newKey) delete newMappings[oldKey];
    newMappings[newKey] = path;
    updateNodeData(nodeId, { mappings: newMappings } as Partial<OutputNodeData>);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Output Mappings</p>
        <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={addMapping}>
          + Add Mapping
        </Button>
      </div>
      {Object.entries(data.mappings).map(([key, path]) => (
        <div key={key} className="flex gap-2">
          <Input
            className="h-7 text-xs"
            value={key}
            onChange={(e) => updateMapping(key, e.target.value, path)}
            placeholder="Key"
          />
          <Input
            className="h-7 text-xs font-mono"
            value={path}
            onChange={(e) => updateMapping(key, key, e.target.value)}
            placeholder="nodeId.result.path"
          />
        </div>
      ))}
    </div>
  );
}

const PipelineNodePanel = () => {
  const { nodes, selectedNodeId, selectNode, removeSelectedNode } = usePipelineStore();
  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) return null;

  return (
    <div className="w-[300px] border-l bg-card flex flex-col shrink-0">
      <div className="flex items-center justify-between p-3 border-b">
        <div>
          <p className="text-sm font-medium">
            {node.data.type === 'tool' ? (node.data as ToolNodeData).toolName : node.data.type === 'input' ? 'Input' : 'Output'}
          </p>
          <p className="text-[10px] text-muted-foreground capitalize">{node.data.type} node</p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={removeSelectedNode}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => selectNode(null)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-3">
        {node.data.type === 'tool' && <ToolNodeConfig data={node.data as ToolNodeData} nodeId={node.id} />}
        {node.data.type === 'input' && <InputNodeConfig data={node.data as InputNodeData} nodeId={node.id} />}
        {node.data.type === 'output' && <OutputNodeConfig data={node.data as OutputNodeData} nodeId={node.id} />}
      </ScrollArea>
    </div>
  );
};

export default PipelineNodePanel;
