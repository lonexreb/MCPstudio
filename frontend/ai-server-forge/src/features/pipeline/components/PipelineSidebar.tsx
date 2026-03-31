import React, { useState } from 'react';
import { PlayCircle, FlagTriangleRight, Wrench, Search, Server } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useServers } from '@/features/servers/hooks/use-servers';
import { useTools } from '@/features/tools/hooks/use-tools';
import { usePipelineStore } from '../stores/pipeline-store';
import type { InputNodeData, OutputNodeData, ToolNodeData } from '../types/pipeline';
import type { Node } from '@xyflow/react';
import type { PipelineNodeData } from '../types/pipeline';

function ToolList({ serverId, serverName, filter }: { serverId: string; serverName: string; filter: string }) {
  const { data: tools } = useTools(serverId);
  const filtered = (tools || []).filter(
    (t) => !filter || t.name.toLowerCase().includes(filter.toLowerCase()),
  );

  if (filtered.length === 0) return null;

  const onDragStart = (e: React.DragEvent, tool: any) => {
    e.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ type: 'tool', serverId, serverName, tool }),
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 px-2 py-1">
        <Server className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">{serverName}</span>
      </div>
      {filtered.map((tool) => (
        <div
          key={tool.id}
          draggable
          onDragStart={(e) => onDragStart(e, tool)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-grab hover:bg-muted/50 active:cursor-grabbing transition-colors"
        >
          <Wrench className="h-3.5 w-3.5 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{tool.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{tool.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const PipelineSidebar = () => {
  const [search, setSearch] = useState('');
  const { data: servers } = useServers();
  const store = usePipelineStore();

  const connectedServers = (servers || []).filter((s) => s.status === 'connected');

  const addSpecialNode = (type: 'input' | 'output') => {
    const id = `${type}-${crypto.randomUUID().slice(0, 8)}`;
    const existing = store.nodes.filter((n) => n.data.type === type);

    const node: Node<PipelineNodeData> = {
      id,
      type,
      position: { x: type === 'input' ? 50 : 600, y: 100 + existing.length * 150 },
      data: type === 'input'
        ? { type: 'input', fields: [], values: {}, status: 'idle' } as InputNodeData
        : { type: 'output', mappings: {}, result: null, status: 'idle' } as OutputNodeData,
    };
    store.addNode(node);
  };

  return (
    <div className="w-[240px] border-r bg-card flex flex-col shrink-0">
      <div className="p-3 border-b space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tool Palette</p>
        <div className="relative">
          <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
      </div>

      <div className="p-2 space-y-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-7"
          onClick={() => addSpecialNode('input')}
        >
          <PlayCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
          Add Input Node
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-7"
          onClick={() => addSpecialNode('output')}
        >
          <FlagTriangleRight className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
          Add Output Node
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 p-2">
        {connectedServers.length === 0 ? (
          <div className="text-center py-6">
            <Server className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">No connected servers</p>
            <p className="text-[10px] text-muted-foreground">Connect a server to see available tools</p>
          </div>
        ) : (
          <div className="space-y-3">
            {connectedServers.map((server) => (
              <ToolList
                key={server.id}
                serverId={server.id}
                serverName={server.name}
                filter={search}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default PipelineSidebar;
