import { Trash2, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/features/execution/lib/db';

const DataManagement = () => {
  const { toast } = useToast();

  const clearExecutions = async () => {
    await db.executions.clear();
    toast({ title: 'Execution history cleared' });
  };

  const clearPipelines = async () => {
    await db.pipelines.clear();
    await db.pipelineExecutions.clear();
    toast({ title: 'Pipelines cleared' });
  };

  const exportData = async () => {
    const executions = await db.executions.toArray();
    const pipelines = await db.pipelines.toArray();
    const data = { executions, pipelines, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcpstudio-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Data exported', description: 'All local data has been downloaded.' });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Local Data</p>
            <p className="text-xs text-muted-foreground">
              Execution history and pipelines are stored in your browser's IndexedDB. These actions cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-1.5" />
            Export All Data
          </Button>
          <Button variant="outline" size="sm" onClick={clearExecutions} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-1.5" />
            Clear Executions
          </Button>
          <Button variant="outline" size="sm" onClick={clearPipelines} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-1.5" />
            Clear Pipelines
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
