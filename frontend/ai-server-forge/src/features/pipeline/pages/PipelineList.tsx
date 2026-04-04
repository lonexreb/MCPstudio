import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Workflow, Clock, GitBranch, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePipelines } from '../hooks/use-pipeline-db';

const cardAccents = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-red-500',
  'from-indigo-500 to-violet-500',
];

const PipelineList = () => {
  const pipelines = usePipelines();
  const navigate = useNavigate();

  return (
    <MainLayout title="Pipelines" subtitle="Visual MCP tool chains">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Pipelines</h2>
          <Button
            onClick={() => navigate('/pipelines/new')}
            className="gradient-brand hover:gradient-brand-hover text-white border-0 shadow-md hover:shadow-lg hover:shadow-purple-500/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Pipeline
          </Button>
        </div>

        {pipelines === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : pipelines.length === 0 ? (
          <div className="border border-dashed border-mcp-purple-500/30 rounded-xl p-10 text-center bg-mcp-purple-500/5">
            <div className="mx-auto w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-4 shadow-lg">
              <Workflow className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No pipelines yet</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              Create a visual pipeline to chain MCP tools together into powerful workflows
            </p>
            <Button
              onClick={() => navigate('/pipelines/new')}
              className="gradient-brand hover:gradient-brand-hover text-white border-0 shadow-md"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create Pipeline
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelines.map((pipeline, i) => (
              <div key={pipeline.id} className="group relative animate-fade-in">
                <div className={`absolute -inset-[1px] rounded-xl bg-gradient-to-br ${cardAccents[i % cardAccents.length]} opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-[2px]`} />
                <Card
                  className="relative overflow-hidden transition-all duration-300 cursor-pointer bg-card hover:shadow-xl"
                  onClick={() => navigate(`/pipelines/${pipeline.id}`)}
                >
                  <div className={`h-[2px] bg-gradient-to-r ${cardAccents[i % cardAccents.length]}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${cardAccents[i % cardAccents.length]} flex items-center justify-center opacity-80`}>
                        <Workflow className="h-4.5 w-4.5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold truncate">{pipeline.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {pipeline.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="h-3.5 w-3.5 text-mcp-purple-400" />
                        <span className="font-medium">{pipeline.nodes.length} nodes</span>
                      </div>
                      <Badge variant="outline" className="text-xs border-mcp-cyan-500/30 text-mcp-cyan-400">
                        {pipeline.edges.length} connections
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/20 px-6 py-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Updated {formatDistanceToNow(new Date(pipeline.updatedAt), { addSuffix: true })}</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PipelineList;
