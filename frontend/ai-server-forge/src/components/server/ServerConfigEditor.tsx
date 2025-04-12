
import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServerConfiguration } from '@/types/mcp';
import TransportConfig from './TransportConfig';
import AuthConfig from './AuthConfig';
import CorsConfig from './CorsConfig';

interface ServerConfigEditorProps {
  config: ServerConfiguration;
  onSave?: (config: ServerConfiguration) => void;
}

const ServerConfigEditor = ({ config, onSave }: ServerConfigEditorProps) => {
  const [transport, setTransport] = useState(config.transport);
  const [authentication, setAuthentication] = useState(config.authentication);
  const [cors, setCors] = useState(config.cors);
  
  const handleSave = () => {
    if (!onSave) return;
    
    onSave({
      transport,
      authentication,
      cors
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Server Configuration</h2>
            <p className="text-sm text-muted-foreground">Configure how clients connect to your MCP server</p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>
      
      <Tabs defaultValue="transport" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="cors">CORS</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transport">
          <Card>
            <CardHeader>
              <CardTitle>Transport Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <TransportConfig 
                transport={transport}
                onChange={setTransport}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <AuthConfig 
                authentication={authentication}
                onChange={setAuthentication}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cors">
          <Card>
            <CardHeader>
              <CardTitle>CORS Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <CorsConfig
                cors={cors}
                onChange={setCors}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServerConfigEditor;
