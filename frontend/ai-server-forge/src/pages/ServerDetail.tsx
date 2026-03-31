
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Wrench,
  Database,
  Lightbulb,
  Settings,
  PlusCircle,
  Hammer,
  Plug,
  PlugZap,
  Unplug,
} from 'lucide-react';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useServer, useConnectServer, useDisconnectServer, useUpdateServer } from '@/hooks/use-servers';
import { useTools } from '@/hooks/use-tools';
import type { ToolResponse } from '@/types/api';

const ServerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: server, isLoading, error } = useServer(id);
  const { data: tools } = useTools(id);
  const connectServer = useConnectServer();
  const disconnectServer = useDisconnectServer();
  const updateServer = useUpdateServer();

  const handleBack = () => {
    navigate('/');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleConnect = () => {
    if (!id) return;
    connectServer.mutate(id, {
      onSuccess: () => toast.success('Server connected! Tools discovered.'),
      onError: (err) => toast.error(err.message || 'Failed to connect'),
    });
  };

  const handleDisconnect = () => {
    if (!id) return;
    disconnectServer.mutate(id, {
      onSuccess: () => toast.success('Server disconnected'),
      onError: (err) => toast.error(err.message || 'Failed to disconnect'),
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 md:col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !server) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-destructive text-lg">Server not found</div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = () => {
    switch (server.status) {
      case 'connected':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusText = () => {
    switch (server.status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  };

  const getConnectButton = () => {
    const isPending = connectServer.isPending || disconnectServer.isPending;

    if (isPending) {
      return (
        <Button disabled className="gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          {connectServer.isPending ? 'Connecting...' : 'Disconnecting...'}
        </Button>
      );
    }

    if (server.status === 'connected') {
      return (
        <Button variant="outline" onClick={handleDisconnect} className="gap-2">
          <Unplug className="h-4 w-4" />
          Disconnect
        </Button>
      );
    }

    return (
      <Button onClick={handleConnect} className="gap-2">
        <PlugZap className="h-4 w-4" />
        Connect & Discover Tools
      </Button>
    );
  };

  const serverTools = tools || server.tools;

  return (
    <MainLayout
      title={server.name}
      subtitle={server.description}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor()}`} />
              <span className="text-sm">{getStatusText()}</span>
            </div>
            {getConnectButton()}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="border-b">
            <div className="container">
              <TabsList className="h-auto p-0">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="tools"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4"
                >
                  Tools
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4"
                >
                  Resources
                </TabsTrigger>
                <TabsTrigger
                  value="prompts"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4"
                >
                  Prompts
                </TabsTrigger>
                <TabsTrigger
                  value="config"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4"
                >
                  Configuration
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="py-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0 py-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div className="border rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-semibold">Server Details</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <p>{server.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Description:</span>
                        <p>{server.description || 'No description'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Connection URL:</span>
                        <p className="font-mono text-sm bg-muted p-2 rounded mt-1">
                          {server.connection_url}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Created:</span>
                        <p>{new Date(server.created_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Last Updated:</span>
                        <p>{new Date(server.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Tools</h3>
                      {server.status !== 'connected' && (
                        <Button variant="outline" size="sm" onClick={handleConnect}>
                          <PlugZap className="h-4 w-4 mr-1" /> Connect to Discover
                        </Button>
                      )}
                    </div>

                    {serverTools.length === 0 ? (
                      <div className="text-center border border-dashed rounded-md p-6">
                        <Wrench className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <h4 className="font-medium mb-1">No Tools Discovered</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connect to the server to discover available tools
                        </p>
                        <Button onClick={handleConnect} disabled={connectServer.isPending}>
                          <PlugZap className="h-4 w-4 mr-1" /> Connect & Discover
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {serverTools.map((tool) => (
                          <div
                            key={tool.id}
                            className="p-4 border rounded-md flex justify-between items-start hover:border-primary/50 cursor-pointer"
                            onClick={() => setActiveTab('tools')}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <Hammer className="h-4 w-4 text-primary" />
                                <h4 className="font-medium">{tool.name}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Connection</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor()}`} />
                          <span>{getStatusText()}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="text-sm text-muted-foreground">URL:</span>
                        <p className="font-mono text-sm mt-1 bg-muted p-2 rounded break-all">
                          {server.connection_url}
                        </p>
                      </div>
                      <div className="pt-2">
                        {getConnectButton()}
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Authentication</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Type:</span>
                        <p className="mt-1 capitalize">{server.auth_config?.type || 'None'}</p>
                      </div>
                      <div className="pt-1">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('config')}>
                          <Settings className="h-4 w-4 mr-1" />
                          Edit Configuration
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="m-0 py-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Wrench className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Tools</h2>
                      <p className="text-sm text-muted-foreground">Discovered tools from this MCP server</p>
                    </div>
                  </div>
                  {server.status !== 'connected' && (
                    <Button onClick={handleConnect} disabled={connectServer.isPending}>
                      <PlugZap className="h-4 w-4 mr-2" />
                      Connect & Discover
                    </Button>
                  )}
                </div>

                {serverTools.length === 0 ? (
                  <div className="text-center border border-dashed rounded-md p-8">
                    <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Tools Discovered</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                      Connect to the MCP server to automatically discover available tools.
                    </p>
                    <Button onClick={handleConnect} disabled={connectServer.isPending}>
                      <PlugZap className="h-4 w-4 mr-2" />
                      Connect & Discover Tools
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(tools || []).map((tool: ToolResponse) => (
                      <div
                        key={tool.id}
                        className="p-5 border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium flex items-center gap-2">
                            <Hammer className="h-4 w-4 text-primary" />
                            {tool.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {Object.keys(tool.parameters).length} params
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                          {tool.description}
                        </p>
                        <div className="space-y-1.5">
                          <div className="bg-muted rounded p-1 px-2 text-xs font-mono overflow-x-auto">
                            {tool.name}({Object.keys(tool.parameters).join(', ')})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="m-0 py-2">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Resources</h2>
                    <p className="text-sm text-muted-foreground">Connected data sources and external services</p>
                  </div>
                </div>
                <div className="text-center border border-dashed rounded-md p-8">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Resource management will be available in a future update.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Prompts Tab */}
            <TabsContent value="prompts" className="m-0 py-2">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Prompt Templates</h2>
                    <p className="text-sm text-muted-foreground">Create reusable prompt patterns</p>
                  </div>
                </div>
                <div className="text-center border border-dashed rounded-md p-8">
                  <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Prompt template management will be available in a future update.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Config Tab */}
            <TabsContent value="config" className="m-0 py-2">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Server Configuration</h2>
                    <p className="text-sm text-muted-foreground">Manage connection and authentication settings</p>
                  </div>
                </div>

                <div className="border rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Connection</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">URL:</span>
                      <p className="font-mono text-sm mt-1 bg-muted p-2 rounded break-all">
                        {server.connection_url}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Authentication</h3>
                  {server.auth_config ? (
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Type:</span>
                        <p className="mt-1 capitalize">{server.auth_config.type}</p>
                      </div>
                      <pre className="bg-muted rounded p-3 text-sm overflow-x-auto">
                        {JSON.stringify(server.auth_config, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No authentication configured</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ServerDetail;
