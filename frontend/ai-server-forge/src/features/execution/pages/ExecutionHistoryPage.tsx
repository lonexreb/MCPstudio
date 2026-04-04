import { useState } from 'react';
import { Clock, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useServerExecutionHistory } from '../hooks/use-server-history';
import { executionsApi, type ExecutionResultResponse } from '@/lib/api/executions';
import { useQueryClient } from '@tanstack/react-query';

const ExecutionRow = ({ execution }: { execution: ExecutionResultResponse }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border/50 rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/20 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <span className="text-sm font-medium truncate">{execution.tool_name}</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
            {execution.server_name}
          </Badge>
        </div>
        <Badge
          variant={execution.status === 'success' ? 'default' : 'destructive'}
          className="text-[10px] px-1.5 py-0 shrink-0"
        >
          {execution.status}
        </Badge>
        <span className="text-xs text-muted-foreground shrink-0 w-16 text-right">
          {execution.execution_time}ms
        </span>
        <span className="text-xs text-muted-foreground shrink-0 w-32 text-right">
          {new Date(execution.created_at).toLocaleString()}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-border/50 p-3 space-y-3">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Parameters</p>
            <pre className="text-xs bg-secondary/30 rounded-md p-2 overflow-auto max-h-32 font-mono">
              {JSON.stringify(execution.parameters, null, 2)}
            </pre>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Result</p>
            <pre className="text-xs bg-secondary/30 rounded-md p-2 overflow-auto max-h-48 font-mono">
              {JSON.stringify(execution.result, null, 2)}
            </pre>
          </div>
          {execution.error_message && (
            <div>
              <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-1">Error</p>
              <p className="text-xs text-red-400">{execution.error_message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ExecutionHistoryPage = () => {
  const [offset, setOffset] = useState(0);
  const limit = 50;
  const { data, isLoading, error } = useServerExecutionHistory({ limit, offset });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleClear = async () => {
    await executionsApi.clear();
    queryClient.invalidateQueries({ queryKey: ['server-executions'] });
    toast({ title: 'History cleared' });
  };

  return (
    <MainLayout title="Execution History" subtitle="Server-side execution log">
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl p-6 gradient-warm shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Execution History</h2>
                <p className="text-white/70 text-sm">
                  {data ? `${data.total} total execution${data.total !== 1 ? 's' : ''}` : 'Loading...'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleClear} className="text-white border-white/30 hover:bg-white/10">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Table header */}
        <div className="flex items-center gap-3 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="w-4" />
          <div className="flex-1">Tool / Server</div>
          <div className="w-16">Status</div>
          <div className="w-16 text-right">Time</div>
          <div className="w-32 text-right">Date</div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="border border-red-500/30 rounded-xl p-8 text-center bg-red-500/5">
            <h3 className="text-lg font-medium mb-2 text-red-400">Failed to load history</h3>
            <p className="text-sm text-muted-foreground">Make sure the backend is running.</p>
          </div>
        ) : data && data.executions.length > 0 ? (
          <div className="space-y-2">
            {data.executions.map((exec) => (
              <ExecutionRow key={exec.id} execution={exec} />
            ))}
            {/* Pagination */}
            {data.total > limit && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  {offset + 1}–{Math.min(offset + limit, data.total)} of {data.total}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= data.total}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-border/50 rounded-xl p-12 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No executions yet</h3>
            <p className="text-sm text-muted-foreground">
              Execute tools from a server to see history here.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExecutionHistoryPage;
