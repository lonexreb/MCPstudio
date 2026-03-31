import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Wrench, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ToolNodeData } from '../../types/pipeline';

const statusStyles: Record<string, string> = {
  idle: 'border-border',
  pending: 'border-yellow-500',
  running: 'border-blue-500 animate-pulse',
  success: 'border-green-500',
  error: 'border-red-500',
  skipped: 'border-muted opacity-50',
};

const statusIcon: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="h-3 w-3 text-green-500" />,
  error: <XCircle className="h-3 w-3 text-red-500" />,
  running: <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />,
};

const ToolNode = ({ data, selected }: NodeProps) => {
  const d = data as ToolNodeData;
  const paramKeys = Object.keys(d.parameters || {});

  return (
    <div
      className={cn(
        'bg-card rounded-lg border-2 shadow-sm w-[240px] overflow-hidden',
        statusStyles[d.status] || statusStyles.idle,
        selected && 'ring-2 ring-primary',
      )}
    >
      <div className="px-3 py-2 bg-muted/50 border-b flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground truncate">{d.serverName}</span>
        {statusIcon[d.status]}
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Wrench className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-medium truncate">{d.toolName}</span>
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-1">{d.description}</p>
      </div>
      <div className="px-3 py-1.5 bg-muted/30 border-t flex items-center justify-between">
        <Badge variant="outline" className="text-[10px] h-5">{paramKeys.length} params</Badge>
        {d.executionTime != null && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            {d.executionTime}ms
          </span>
        )}
      </div>

      {/* Input handles — one per parameter */}
      {paramKeys.map((key, i) => (
        <Handle
          key={`in-${key}`}
          type="target"
          position={Position.Left}
          id={`param-${key}`}
          style={{ top: `${30 + ((i + 1) / (paramKeys.length + 1)) * 60}%` }}
          className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-background"
        />
      ))}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-2.5 !h-2.5 !bg-green-500 !border-2 !border-background"
      />
    </div>
  );
};

export default memo(ToolNode);
