import React from 'react';
import { CheckCircle2, XCircle, Clock, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useExecutionHistory } from '@/features/execution/hooks/use-execution-history';
import { formatDistanceToNow } from 'date-fns';

interface ExecutionHistoryProps {
  serverId?: string;
  onSelect?: (record: any) => void;
}

const ExecutionHistory = ({ serverId, onSelect }: ExecutionHistoryProps) => {
  const records = useExecutionHistory(serverId);

  if (!records || records.length === 0) {
    return (
      <div className="text-center border border-dashed rounded-md p-6">
        <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <h4 className="font-medium mb-1">No Execution History</h4>
        <p className="text-sm text-muted-foreground">
          Execute a tool to see results here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {records.map((record) => (
        <div
          key={record.id}
          className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => onSelect?.(record)}
        >
          <div className="flex items-center gap-3 min-w-0">
            {record.status === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Wrench className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium truncate">{record.toolName}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs">
              {record.executionTime}ms
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExecutionHistory;
