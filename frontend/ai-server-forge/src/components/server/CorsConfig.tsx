
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

interface CorsSettings {
  enabled: boolean;
  origins: string[];
}

interface CorsConfigProps {
  cors: CorsSettings;
  onChange: (cors: CorsSettings) => void;
}

const CorsConfig = ({ cors, onChange }: CorsConfigProps) => {
  const handleToggle = (enabled: boolean) => {
    onChange({
      ...cors,
      enabled
    });
  };
  
  const handleAddOrigin = () => {
    onChange({
      ...cors,
      origins: [...cors.origins, '']
    });
  };
  
  const handleUpdateOrigin = (index: number, value: string) => {
    const newOrigins = [...cors.origins];
    newOrigins[index] = value;
    onChange({
      ...cors,
      origins: newOrigins
    });
  };
  
  const handleRemoveOrigin = (index: number) => {
    onChange({
      ...cors,
      origins: cors.origins.filter((_, i) => i !== index)
    });
  };
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Configure Cross-Origin Resource Sharing (CORS) settings to control which domains can access your MCP server.
      </p>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="cors-enabled"
          checked={cors.enabled}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="cors-enabled">Enable CORS</Label>
      </div>
      
      {cors.enabled && (
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <Label>Allowed Origins</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddOrigin}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Origin
            </Button>
          </div>
          
          <div className="space-y-2">
            {cors.origins.length === 0 ? (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">
                  No origins defined. Add origins to restrict access, or use "*" to allow all origins.
                </p>
              </div>
            ) : (
              cors.origins.map((origin, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={origin}
                    onChange={(e) => handleUpdateOrigin(index, e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOrigin(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              Use "*" to allow all origins (not recommended for production)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorsConfig;
