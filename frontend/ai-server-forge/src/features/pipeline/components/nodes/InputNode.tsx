import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { PlayCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InputNodeData } from '../../types/pipeline';

const statusStyles: Record<string, string> = {
  idle: 'border-border',
  pending: 'border-yellow-500',
  success: 'border-green-500',
};

const InputNode = ({ data, selected }: NodeProps) => {
  const d = data as InputNodeData;

  return (
    <div
      className={cn(
        'bg-card rounded-lg border-2 shadow-sm w-[190px] overflow-hidden',
        statusStyles[d.status] || statusStyles.idle,
        selected && 'ring-2 ring-primary',
      )}
    >
      <div className="px-3 py-2 flex items-center gap-2">
        <PlayCircle className="h-4 w-4 text-green-500" />
        <span className="text-sm font-medium">Pipeline Input</span>
        {d.status === 'success' && <CheckCircle2 className="h-3 w-3 text-green-500 ml-auto" />}
      </div>
      {d.fields.length > 0 && (
        <div className="px-3 py-1.5 bg-muted/30 border-t">
          {d.fields.map((f) => (
            <div key={f.key} className="text-[11px] text-muted-foreground">
              {f.key}: <span className="text-foreground">{f.type}</span>
            </div>
          ))}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-2.5 !h-2.5 !bg-green-500 !border-2 !border-background"
      />
    </div>
  );
};

export default memo(InputNode);
