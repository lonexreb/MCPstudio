import React, { useState } from 'react';
import { Play, Loader2, Server, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ParameterForm from './ParameterForm';
import ExecutionResult from './ExecutionResult';
import { useServers } from '@/features/servers/hooks/use-servers';
import { useTools } from '@/features/tools/hooks/use-tools';
import { toolsApi } from '@/lib/api/tools';
import { saveExecution } from '@/features/execution/hooks/use-execution-history';
import type { ToolResponse, ToolExecutionResponse } from '@/types/api';

export interface ArenaResult {
  tool: ToolResponse;
  serverName: string;
  response: ToolExecutionResponse;
}

interface ArenaPanelProps {
  label: string;
  onResult?: (result: ArenaResult | null) => void;
}

const ArenaPanel = ({ label, onResult }: ArenaPanelProps) => {
  const { data: servers } = useServers();
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [selectedToolId, setSelectedToolId] = useState<string>('');
  const { data: tools } = useTools(selectedServerId || undefined);
  const [params, setParams] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ToolExecutionResponse | null>(null);

  const connectedServers = (servers || []).filter((s) => s.status === 'connected');
  const selectedServer = connectedServers.find((s) => s.id === selectedServerId);
  const selectedTool = (tools || []).find((t: ToolResponse) => t.id === selectedToolId) as ToolResponse | undefined;

  const handleServerChange = (serverId: string) => {
    setSelectedServerId(serverId);
    setSelectedToolId('');
    setParams({});
    setLastResult(null);
    onResult?.(null);
  };

  const handleToolChange = (toolId: string) => {
    setSelectedToolId(toolId);
    setParams({});
    setLastResult(null);
    onResult?.(null);
  };

  const handleExecute = async () => {
    if (!selectedTool || !selectedServerId) return;

    setIsExecuting(true);
    try {
      const result = await toolsApi.execute(selectedServerId, selectedTool.id, { parameters: params });
      setLastResult(result);

      await saveExecution({
        serverId: selectedServerId,
        serverName: selectedServer?.name || '',
        toolId: selectedTool.id,
        toolName: selectedTool.name,
        parameters: params,
        result: result.result,
        status: result.status,
        executionTime: result.execution_time,
        timestamp: new Date(),
      }).catch(() => {});

      onResult?.({
        tool: selectedTool,
        serverName: selectedServer?.name || '',
        response: result,
      });
    } catch (err: any) {
      toast.error(err.message || 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between shrink-0">
        <span className="text-sm font-semibold">{label}</span>
        <Button
          size="sm"
          className="h-7 text-xs"
          onClick={handleExecute}
          disabled={isExecuting || !selectedTool}
        >
          {isExecuting ? (
            <><Loader2 className="h-3 w-3 mr-1 animate-spin" />Running...</>
          ) : (
            <><Play className="h-3 w-3 mr-1" />Execute</>
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Server selector */}
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1">
              <Server className="h-3 w-3" /> Server
            </Label>
            <Select value={selectedServerId} onValueChange={handleServerChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select a server" />
              </SelectTrigger>
              <SelectContent>
                {connectedServers.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-xs">
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {connectedServers.length === 0 && (
              <p className="text-[10px] text-muted-foreground">No connected servers available</p>
            )}
          </div>

          {/* Tool selector */}
          {selectedServerId && (
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <Wrench className="h-3 w-3" /> Tool
              </Label>
              <Select value={selectedToolId} onValueChange={handleToolChange}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select a tool" />
                </SelectTrigger>
                <SelectContent>
                  {(tools || []).map((t: ToolResponse) => (
                    <SelectItem key={t.id} value={t.id} className="text-xs">
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Parameters */}
          {selectedTool && (
            <>
              <Separator />
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Parameters</Label>
                <ParameterForm
                  parameters={selectedTool.parameters}
                  values={params}
                  onChange={setParams}
                />
              </div>
            </>
          )}

          {/* Result */}
          {lastResult && (
            <>
              <Separator />
              <ExecutionResult
                result={lastResult.result}
                status={lastResult.status}
                executionTime={lastResult.execution_time}
              />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArenaPanel;
