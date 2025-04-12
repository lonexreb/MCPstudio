
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wrench, 
  Database, 
  Lightbulb,
  Terminal,
  Settings,
  PlusCircle,
  Hammer,
  Server as ServerIcon,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MCPServer, Tool, sampleServers } from '@/types/mcp';
import ToolEditor from '@/components/tool/ToolEditor';
import ServerConfigEditor from '@/components/server/ServerConfigEditor';

const ServerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [server, setServer] = useState<MCPServer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  
  useEffect(() => {
    setTimeout(() => {
      const foundServer = sampleServers.find(s => s.id === id);
      if (foundServer) {
        setServer(foundServer);
      } else {
        toast.error('Server not found');
        navigate('/');
      }
      setIsLoading(false);
    }, 500);
  }, [id, navigate]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setEditingTool(null);
  };
  
  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setActiveTab('tools');
  };
  
  const handleNewTool = () => {
    setEditingTool({} as Tool);
    setActiveTab('tools');
  };
  
  const handleSaveTool = (tool: Tool) => {
    if (!server) return;
    
    const updatedServer = { ...server };
    const toolIndex = updatedServer.tools.findIndex(t => t.id === tool.id);
    
    if (toolIndex >= 0) {
      updatedServer.tools[toolIndex] = tool;
    } else {
      updatedServer.tools = [...updatedServer.tools, tool];
    }
    
    setServer(updatedServer);
    setEditingTool(null);
    toast.success(`Tool ${tool.name} saved successfully`);
  };
  
  const handleSaveConfig = (config: any) => {
    if (!server) return;
    
    const updatedServer = { 
      ...server,
      config
    };
    
    setServer(updatedServer);
    toast.success('Server configuration saved successfully');
  };
  
  const handleDeploy = () => {
    if (!server) return;
    
    toast.info('Deploying server...');
    
    setTimeout(() => {
      const updatedServer = { 
        ...server,
        deploymentState: 'DEPLOYING' as const
      };
      
      setServer(updatedServer);
      
      setTimeout(() => {
        const deployedServer = { 
          ...updatedServer,
          deploymentState: 'DEPLOYED' as const,
          deploymentUrl: `https://${server.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.example.mcp`,
          updatedAt: new Date().toISOString()
        };
        
        setServer(deployedServer);
        toast.success('Server deployed successfully!');
      }, 3000);
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading server details...</div>
        </div>
      </MainLayout>
    );
  }
  
  if (!server) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-destructive">Server not found</div>
        </div>
      </MainLayout>
    );
  }
  
  const getStatusColor = () => {
    switch (server.deploymentState) {
      case 'DEPLOYED':
        return 'bg-green-500';
      case 'DEPLOYING':
        return 'bg-amber-500 animate-pulse';
      case 'FAILED':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };
  
  const getDeployButton = () => {
    switch (server.deploymentState) {
      case 'DEPLOYED':
        return (
          <Button variant="outline" className="gap-2">
            <Globe className="h-4 w-4" />
            View Deployed Server
          </Button>
        );
      case 'DEPLOYING':
        return (
          <Button disabled className="gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Deploying...
          </Button>
        );
      case 'FAILED':
        return (
          <Button variant="destructive" onClick={handleDeploy} className="gap-2">
            <ServerIcon className="h-4 w-4" />
            Retry Deployment
          </Button>
        );
      default:
        return (
          <Button onClick={handleDeploy} className="gap-2">
            <ServerIcon className="h-4 w-4" />
            Deploy Server
          </Button>
        );
    }
  };
  
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
              <span className="text-sm">{server.deploymentState.replace('_', ' ')}</span>
            </div>
            {getDeployButton()}
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
                        <p>{server.description}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Created:</span>
                        <p>{new Date(server.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Last Updated:</span>
                        <p>{new Date(server.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Tools</h3>
                      <Button variant="outline" size="sm" onClick={handleNewTool}>
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Tool
                      </Button>
                    </div>
                    
                    {server.tools.length === 0 ? (
                      <div className="text-center border border-dashed rounded-md p-6">
                        <Wrench className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <h4 className="font-medium mb-1">No Tools Defined</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add tools to expose capabilities to AI agents
                        </p>
                        <Button onClick={handleNewTool}>
                          <PlusCircle className="h-4 w-4 mr-1" /> Add Your First Tool
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {server.tools.map((tool) => (
                          <div 
                            key={tool.id}
                            className="p-4 border rounded-md flex justify-between items-start hover:border-primary/50 cursor-pointer"
                            onClick={() => handleEditTool(tool)}
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
                            <Badge variant="outline">{tool.parameters.length} params</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Deployment</h3>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor()}`} />
                          <span>{server.deploymentState.replace('_', ' ')}</span>
                        </div>
                      </div>
                      
                      {server.deploymentUrl && (
                        <div className="pt-2">
                          <span className="text-sm text-muted-foreground">URL:</span>
                          <p className="font-mono text-sm mt-1 bg-muted p-2 rounded break-all">
                            {server.deploymentUrl}
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        {getDeployButton()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Configuration</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Transport:</span>
                        <p className="mt-1">{server.config.transport.toUpperCase()}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Authentication:</span>
                        <p className="mt-1 capitalize">{server.config.authentication.type || "None"}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">CORS:</span>
                        <p className="mt-1">{server.config.cors.enabled ? "Enabled" : "Disabled"}</p>
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
            
            <TabsContent value="tools" className="m-0 py-2">
              {editingTool ? (
                <ToolEditor 
                  tool={editingTool.id ? editingTool : undefined} 
                  onSave={handleSaveTool}
                  isNew={!editingTool.id}
                />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Wrench className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Tools</h2>
                        <p className="text-sm text-muted-foreground">Create and manage AI-accessible functions</p>
                      </div>
                    </div>
                    <Button onClick={handleNewTool}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Tool
                    </Button>
                  </div>
                  
                  {server.tools.length === 0 ? (
                    <div className="text-center border border-dashed rounded-md p-8">
                      <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-2">No Tools Defined</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                        Tools are functions that AI agents can call through your MCP server.
                        Add tools to provide capabilities to AI systems.
                      </p>
                      <Button onClick={handleNewTool}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Your First Tool
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {server.tools.map((tool) => (
                        <div 
                          key={tool.id}
                          className="p-5 border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                          onClick={() => handleEditTool(tool)}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium flex items-center gap-2">
                              <Hammer className="h-4 w-4 text-primary" />
                              {tool.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {tool.parameters.length} params
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 mb-3">
                            {tool.description}
                          </p>
                          <div className="space-y-1.5">
                            <div className="bg-muted rounded p-1 px-2 text-xs font-mono overflow-x-auto">
                              {tool.name}({tool.parameters.map(p => p.name).join(', ')})
                            </div>
                            <div className="text-xs text-muted-foreground flex gap-1 flex-wrap">
                              {tool.parameters.map((param) => (
                                <span 
                                  key={param.name}
                                  className="border rounded-full px-2 py-0.5"
                                >
                                  {param.name}: {param.type}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div 
                        className="border border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={handleNewTool}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <PlusCircle className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium">Add New Tool</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Create a new function for AI agents
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resources" className="m-0 py-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Resources</h2>
                      <p className="text-sm text-muted-foreground">Connect data sources and external services</p>
                    </div>
                  </div>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Resource
                  </Button>
                </div>
                
                {server.resources.length === 0 ? (
                  <div className="text-center border border-dashed rounded-md p-8">
                    <Database className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Resources Connected</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                      Resources connect your MCP server to data sources and external services.
                    </p>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Connect a Resource
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {server.resources.map((resource) => (
                      <div 
                        key={resource.id}
                        className="p-5 border rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{resource.name}</h3>
                          <Badge>{resource.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {resource.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="prompts" className="m-0 py-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Prompt Templates</h2>
                      <p className="text-sm text-muted-foreground">Create reusable prompt patterns</p>
                    </div>
                  </div>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
                
                {server.prompts.length === 0 ? (
                  <div className="text-center border border-dashed rounded-md p-8">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Prompt Templates</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                      Prompt templates help structure interactions with AI models.
                    </p>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {server.prompts.map((prompt) => (
                      <div 
                        key={prompt.id}
                        className="p-5 border rounded-lg"
                      >
                        <h3 className="font-medium">{prompt.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {prompt.description}
                        </p>
                        <div className="bg-muted rounded p-2 mt-3 text-sm">
                          {prompt.template}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="config" className="m-0 py-2">
              <ServerConfigEditor
                config={server.config}
                onSave={handleSaveConfig}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ServerDetail;
