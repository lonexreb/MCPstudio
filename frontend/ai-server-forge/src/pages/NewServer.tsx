import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  ArrowLeft,
  Check,
  Server,
  Wrench,
  Database,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createNewServer } from '@/types/mcp';

const NewServer = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleCreate = () => {
    if (!name) {
      toast.error("Please provide a server name");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newServer = createNewServer();
      newServer.name = name;
      newServer.description = description;
      
      toast.success("MCP server created successfully");
      navigate(`/server/${newServer.id}`);
    }, 1000);
  };
  
  return (
    <MainLayout title="Create New MCP Server">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Create New MCP Server</CardTitle>
            <CardDescription>
              Set up a new Model Context Protocol server to expose capabilities to AI agents
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Server Name</Label>
              <Input 
                id="name" 
                placeholder="Enter a name for your server"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the purpose of this MCP server"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                A clear description helps users understand what capabilities this server provides
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t p-6 bg-muted/30">
            <Button variant="outline" onClick={handleBack}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  Creating... <span className="ml-2 animate-spin">⏳</span>
                </span>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Server
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:bg-accent/5 transition-colors">
            <CardHeader className="flex flex-row items-start space-x-2">
              <Wrench className="h-6 w-6 text-primary mt-1" />
              <div>
                <CardTitle>Define Tools</CardTitle>
                <CardDescription>Create custom tools that AI agents can use</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                After creating your server, you can define tools that expose functionality to AI agents
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:bg-accent/5 transition-colors">
            <CardHeader className="flex flex-row items-start space-x-2">
              <Database className="h-6 w-6 text-primary mt-1" />
              <div>
                <CardTitle>Connect Resources</CardTitle>
                <CardDescription>Link data sources and external services</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect databases, APIs, and other resources that your MCP server can utilize
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:bg-accent/5 transition-colors">
            <CardHeader className="flex flex-row items-start space-x-2">
              <Settings className="h-6 w-6 text-primary mt-1" />
              <div>
                <CardTitle>Configure & Deploy</CardTitle>
                <CardDescription>Set up authentication and deploy your server</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure security settings and deploy your MCP server for AI agents to use
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:bg-accent/5 transition-colors">
            <CardHeader className="flex flex-row items-start space-x-2">
              <Server className="h-6 w-6 text-primary mt-1" />
              <div>
                <CardTitle>Test & Monitor</CardTitle>
                <CardDescription>Validate and monitor server operations</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Test your MCP server's functionality and monitor usage metrics
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewServer;
