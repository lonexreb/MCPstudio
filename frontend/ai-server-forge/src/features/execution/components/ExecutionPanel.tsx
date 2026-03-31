import React, { useState } from 'react';
import { Play, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TerminalAnimation, type TerminalLine } from '@/components/ui/terminal-animation';
import ParameterForm from './ParameterForm';
import ExecutionResult from './ExecutionResult';
import ExecutionHistory from './ExecutionHistory';
import { toolsApi } from '@/lib/api/tools';
import { saveExecution } from '@/features/execution/hooks/use-execution-history';
import type { ToolResponse, ToolExecutionResponse } from '@/types/api';

interface ExecutionPanelProps {
  serverId: string;
  serverName: string;
  tool: ToolResponse;
}

const ExecutionPanel = ({ serverId, serverName, tool }: ExecutionPanelProps) => {
  const [params, setParams] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ToolExecutionResponse | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    setShowTerminal(true);
    setLastResult(null);

    setTerminalLines([
      { text: `Executing ${tool.name}...`, type: 'command' },
      { text: `Server: ${serverName}`, type: 'info' },
      { text: `Parameters: ${JSON.stringify(params)}`, type: 'info' },
    ]);

    const startTime = Date.now();

    try {
      const result = await toolsApi.execute(serverId, tool.id, { parameters: params });
      const elapsed = Date.now() - startTime;

      setLastResult(result);
      setTerminalLines((prev) => [
        ...prev,
        { text: `Completed in ${result.execution_time || elapsed}ms`, type: 'success' },
        { text: `Status: ${result.status}`, type: result.status === 'success' ? 'success' : 'error' },
      ]);

      await saveExecution({
        serverId,
        serverName,
        toolId: tool.id,
        toolName: tool.name,
        parameters: params,
        result: result.result,
        status: result.status,
        executionTime: result.execution_time || elapsed,
        timestamp: new Date(),
      });
    } catch (err: any) {
      const elapsed = Date.now() - startTime;
      setTerminalLines((prev) => [
        ...prev,
        { text: `Error: ${err.message}`, type: 'error' },
      ]);

      await saveExecution({
        serverId,
        serverName,
        toolId: tool.id,
        toolName: tool.name,
        parameters: params,
        result: { error: err.message },
        status: 'error',
        executionTime: elapsed,
        timestamp: new Date(),
      });

      toast.error(`Execution failed: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setParams({});
    setLastResult(null);
    setShowTerminal(false);
    setTerminalLines([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Parameters + Execute */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset} disabled={isExecuting}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleExecute} disabled={isExecuting}>
                    {isExecuting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 mr-1" />
                        Execute
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </CardHeader>
            <CardContent>
              <ParameterForm
                parameters={tool.parameters}
                values={params}
                onChange={setParams}
              />
            </CardContent>
          </Card>

          {showTerminal && (
            <TerminalAnimation
              lines={terminalLines}
              speed={100}
              title={`${tool.name} - Execution`}
            />
          )}

          {lastResult && (
            <ExecutionResult
              result={lastResult.result}
              status={lastResult.status}
              executionTime={lastResult.execution_time}
            />
          )}
        </div>

        {/* Right: History */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <ExecutionHistory serverId={serverId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;
