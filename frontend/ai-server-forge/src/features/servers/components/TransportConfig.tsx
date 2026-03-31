
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface TransportConfigProps {
  transport: 'http' | 'websocket' | 'both';
  onChange: (transport: 'http' | 'websocket' | 'both') => void;
}

const TransportConfig = ({ transport, onChange }: TransportConfigProps) => {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select how clients should connect to your MCP server. HTTP is simpler and works for most use cases, 
        while WebSockets enable real-time communication.
      </p>
      
      <RadioGroup value={transport} onValueChange={onChange as any}>
        <div className="flex items-start space-x-2 mb-4">
          <RadioGroupItem value="http" id="r-http" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="r-http" className="font-medium">HTTP</Label>
            <p className="text-sm text-muted-foreground">
              Standard HTTP REST API with request-response pattern. Best for simple integrations and compatibility.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2 mb-4">
          <RadioGroupItem value="websocket" id="r-websocket" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="r-websocket" className="font-medium">WebSocket</Label>
            <p className="text-sm text-muted-foreground">
              Real-time bidirectional communication. Best for applications requiring live updates and streaming.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="both" id="r-both" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="r-both" className="font-medium">Both (HTTP & WebSocket)</Label>
            <p className="text-sm text-muted-foreground">
              Support both transport methods. Most flexible but requires more configuration.
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default TransportConfig;
