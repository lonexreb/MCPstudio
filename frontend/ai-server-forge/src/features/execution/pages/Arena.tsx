import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import ArenaPanel, { type ArenaResult } from '../components/ArenaPanel';
import ComparisonView from '../components/ComparisonView';

const Arena = () => {
  const [leftResult, setLeftResult] = useState<ArenaResult | null>(null);
  const [rightResult, setRightResult] = useState<ArenaResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const hasBothResults = !!leftResult && !!rightResult;

  return (
    <MainLayout title="Execution Arena" subtitle="Compare tool executions side by side">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Select a server and tool in each panel, execute, then compare results.
          </p>
          <Button
            variant={showComparison ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            disabled={!hasBothResults}
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            {showComparison ? 'Hide Comparison' : 'Compare Results'}
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50} minSize={30}>
              <ArenaPanel label="Panel A" onResult={setLeftResult} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <ArenaPanel label="Panel B" onResult={setRightResult} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {showComparison && hasBothResults && (
          <ComparisonView left={leftResult} right={rightResult} />
        )}
      </div>
    </MainLayout>
  );
};

export default Arena;
