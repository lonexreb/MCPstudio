import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Workflow, Clock, GitBranch } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePipelines } from '../hooks/use-pipeline-db';

const PipelineList = () => {
  const pipelines = usePipelines();
  const navigate = useNavigate();

  return (
    <MainLayout title="Pipelines" subtitle="Visual MCP tool chains">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Pipelines</h2>
          <Button onClick={() => navigate('/pipelines/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Pipeline
          </Button>
        </div>

        {pipelines === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : pipelines.length === 0 ? (
          <div className="border border-dashed rounded-md p-8 text-center">
            <Workflow className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No pipelines yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a visual pipeline to chain MCP tools together
            </p>
            <Button onClick={() => navigate('/pipelines/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Pipeline
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelines.map((pipeline) => (
              <Card
                key={pipeline.id}
                className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => navigate(`/pipelines/${pipeline.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Workflow className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold truncate">{pipeline.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {pipeline.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{pipeline.nodes.length} nodes</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {pipeline.edges.length} connections
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 px-6 py-3 border-t">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Updated {formatDistanceToNow(new Date(pipeline.updatedAt), { addSuffix: true })}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PipelineList;
