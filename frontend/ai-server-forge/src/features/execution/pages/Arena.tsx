import React, { useState } from 'react';
import { ArrowLeftRight, Swords } from 'lucide-react';
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
        {/* Arena header */}
        <div data-tour="arena-hero" className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg gradient-warm flex items-center justify-center shadow-md">
              <Swords className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm text-muted-foreground">
              Select a server and tool in each panel, execute, then compare results.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            disabled={!hasBothResults}
            className={showComparison
              ? 'gradient-warm text-white border-0 shadow-md'
              : 'border-mcp-pink-500/30 text-mcp-pink-400 hover:bg-mcp-pink-500/10 bg-transparent'
            }
            variant={showComparison ? 'default' : 'outline'}
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            {showComparison ? 'Hide Comparison' : 'Compare Results'}
          </Button>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-border/50" style={{ height: 'calc(100vh - 280px)' }}>
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] gradient-sunset z-10" />
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
