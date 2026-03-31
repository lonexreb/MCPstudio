import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { FlagTriangleRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutputNodeData } from '../../types/pipeline';

const statusStyles: Record<string, string> = {
  idle: 'border-border',
  pending: 'border-yellow-500',
  success: 'border-green-500',
  error: 'border-red-500',
};

const OutputNode = ({ data, selected }: NodeProps) => {
  const d = data as OutputNodeData;

  return (
    <div
      className={cn(
        'bg-card rounded-lg border-2 shadow-sm w-[190px] overflow-hidden',
        statusStyles[d.status] || statusStyles.idle,
        selected && 'ring-2 ring-primary',
      )}
    >
      <div className="px-3 py-2 flex items-center gap-2">
        <FlagTriangleRight className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">Pipeline Output</span>
        {d.status === 'success' && <CheckCircle2 className="h-3 w-3 text-green-500 ml-auto" />}
      </div>
      {d.result && (
        <div className="px-3 py-1.5 bg-muted/30 border-t">
          <pre className="text-[10px] text-muted-foreground max-h-16 overflow-auto">
            {JSON.stringify(d.result, null, 2)}
          </pre>
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-background"
      />
    </div>
  );
};

export default memo(OutputNode);
