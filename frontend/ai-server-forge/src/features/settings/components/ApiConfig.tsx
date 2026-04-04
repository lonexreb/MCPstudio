import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '../stores/settings-store';
import { useToast } from '@/hooks/use-toast';

const ApiConfig = () => {
  const { apiBaseUrl, setApiBaseUrl } = useSettingsStore();
  const [url, setUrl] = useState(apiBaseUrl);
  const { toast } = useToast();

  const handleSave = () => {
    try {
      new URL(url);
      setApiBaseUrl(url);
      toast({ title: 'API URL updated', description: 'The API base URL has been saved.' });
    } catch {
      toast({ title: 'Invalid URL', description: 'Please enter a valid URL.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30 border border-border/50">
        <Globe className="h-5 w-5 text-mcp-blue-400 shrink-0" />
        <div className="flex-1 space-y-2">
          <Label htmlFor="api-url" className="text-sm font-medium">API Base URL</Label>
          <p className="text-xs text-muted-foreground">The backend server URL for MCPStudio API requests</p>
          <div className="flex gap-2">
            <Input
              id="api-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:8005"
              className="font-mono text-sm"
            />
            <Button
              size="sm"
              onClick={handleSave}
              disabled={url === apiBaseUrl}
              className="gradient-brand shrink-0"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfig;
