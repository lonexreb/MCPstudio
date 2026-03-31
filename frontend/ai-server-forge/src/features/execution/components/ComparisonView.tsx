import React from 'react';
import { ArrowLeftRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ArenaResult } from './ArenaPanel';

interface ComparisonViewProps {
  left: ArenaResult | null;
  right: ArenaResult | null;
}

function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
  if (obj == null || typeof obj !== 'object') {
    return { [prefix || '(value)']: obj };
  }
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}

const ComparisonView = ({ left, right }: ComparisonViewProps) => {
  if (!left || !right) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <ArrowLeftRight className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Execute tools in both panels to compare results
        </p>
      </div>
    );
  }

  const leftFlat = flattenObject(left.response.result);
  const rightFlat = flattenObject(right.response.result);
  const allKeys = Array.from(new Set([...Object.keys(leftFlat), ...Object.keys(rightFlat)])).sort();

  const leftTime = left.response.execution_time;
  const rightTime = right.response.execution_time;
  const faster = leftTime < rightTime ? 'left' : leftTime > rightTime ? 'right' : 'tie';

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 bg-muted/50 border-b text-xs">
        <div className="px-4 py-2 font-medium flex items-center gap-2">
          {left.response.status === 'success'
            ? <CheckCircle2 className="h-3 w-3 text-green-500" />
            : <XCircle className="h-3 w-3 text-red-500" />}
          {left.tool.name}
          <Badge variant="outline" className="text-[10px] ml-auto">
            <Clock className="h-2.5 w-2.5 mr-0.5" />
            {leftTime}ms
          </Badge>
          {faster === 'left' && <Badge className="text-[10px] bg-green-500">Faster</Badge>}
        </div>
        <div className="px-4 py-2 font-medium text-center text-muted-foreground border-x">
          Key
        </div>
        <div className="px-4 py-2 font-medium flex items-center gap-2">
          {right.response.status === 'success'
            ? <CheckCircle2 className="h-3 w-3 text-green-500" />
            : <XCircle className="h-3 w-3 text-red-500" />}
          {right.tool.name}
          <Badge variant="outline" className="text-[10px] ml-auto">
            <Clock className="h-2.5 w-2.5 mr-0.5" />
            {rightTime}ms
          </Badge>
          {faster === 'right' && <Badge className="text-[10px] bg-green-500">Faster</Badge>}
        </div>
      </div>

      {/* Diff rows */}
      <div className="max-h-64 overflow-auto">
        {allKeys.map((key) => {
          const lVal = JSON.stringify(leftFlat[key] ?? null);
          const rVal = JSON.stringify(rightFlat[key] ?? null);
          const isDiff = lVal !== rVal;
          const isMissing = !(key in leftFlat) || !(key in rightFlat);

          return (
            <div
              key={key}
              className={cn(
                'grid grid-cols-3 text-xs border-b last:border-0',
                isDiff && 'bg-yellow-500/5',
                isMissing && 'bg-red-500/5',
              )}
            >
              <div className={cn('px-4 py-1.5 font-mono truncate', isDiff && 'text-yellow-600 dark:text-yellow-400')}>
                {key in leftFlat ? lVal : <span className="text-muted-foreground italic">missing</span>}
              </div>
              <div className="px-4 py-1.5 font-mono text-muted-foreground border-x truncate text-center">
                {key}
                {isDiff && <ArrowLeftRight className="h-2.5 w-2.5 inline ml-1 text-yellow-500" />}
              </div>
              <div className={cn('px-4 py-1.5 font-mono truncate', isDiff && 'text-yellow-600 dark:text-yellow-400')}>
                {key in rightFlat ? rVal : <span className="text-muted-foreground italic">missing</span>}
              </div>
            </div>
          );
        })}
        {allKeys.length === 0 && (
          <div className="px-4 py-4 text-center text-xs text-muted-foreground">
            No result data to compare
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonView;
