import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExecutionResultProps {
  result: Record<string, any> | null;
  status: 'success' | 'error';
  executionTime: number;
  className?: string;
}

const ExecutionResult = ({ result, status, executionTime, className }: ExecutionResultProps) => {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const jsonString = result ? JSON.stringify(result, null, 2) : 'null';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      <div
        className="flex items-center justify-between px-4 py-3 bg-muted/50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {status === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <Badge variant={status === 'success' ? 'default' : 'destructive'} className="text-xs">
            {status}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {executionTime}ms
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); handleCopy(); }}>
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      {expanded && (
        <pre className="p-4 text-sm overflow-x-auto bg-black text-green-400 font-mono max-h-96">
          {jsonString}
        </pre>
      )}
    </div>
  );
};

export default ExecutionResult;
