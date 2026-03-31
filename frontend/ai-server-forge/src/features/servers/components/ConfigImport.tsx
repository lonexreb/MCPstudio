import React, { useState, useRef } from 'react';
import { Upload, FileUp, AlertCircle, Server, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseImport, type ServerExportConfig } from '../lib/config-serializer';
import { useCreateServer } from '../hooks/use-servers';

const ConfigImport = () => {
  const navigate = useNavigate();
  const createServer = useCreateServer();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [rawContent, setRawContent] = useState('');
  const [parsed, setParsed] = useState<ServerExportConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setRawContent('');
    setParsed(null);
    setError(null);
  };

  const handleParse = (content: string) => {
    setRawContent(content);
    if (!content.trim()) {
      setParsed(null);
      setError(null);
      return;
    }

    const result = parseImport(content);
    if (result.success) {
      setParsed(result.config);
      setError(null);
    } else {
      setParsed(null);
      setError(result.error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      handleParse(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      handleParse(content);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!parsed) return;

    createServer.mutate(
      {
        name: parsed.name,
        description: parsed.description,
        connection_url: parsed.connection_url,
        ...(parsed.auth_type ? { auth_config: { type: parsed.auth_type, credentials: {} } } : {}),
      },
      {
        onSuccess: (server) => {
          toast.success(`Server "${parsed.name}" imported successfully`);
          setOpen(false);
          reset();
          navigate(`/server/${server.id}`);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to import server');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1.5">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Server Configuration</DialogTitle>
          <DialogDescription>
            Upload a JSON or YAML config file, or paste the content directly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File upload area */}
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drop a .json or .yaml file here, or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.yaml,.yml"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Paste area */}
          <div className="space-y-1.5">
            <Label className="text-sm">Or paste configuration:</Label>
            <Textarea
              value={rawContent}
              onChange={(e) => handleParse(e.target.value)}
              placeholder='{"name": "My Server", "connection_url": "https://...", ...}'
              rows={6}
              className="font-mono text-xs"
            />
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs whitespace-pre-wrap">{error}</AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {parsed && (
            <div className="border rounded-lg p-4 space-y-2 bg-muted/30">
              <p className="text-sm font-medium">Preview:</p>
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                <span className="font-medium">{parsed.name}</span>
              </div>
              {parsed.description && (
                <p className="text-xs text-muted-foreground">{parsed.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{parsed.connection_url}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                <Badge variant="outline" className="text-xs">{parsed.tools.length} tools</Badge>
                {parsed.auth_type && (
                  <Badge variant="secondary" className="text-xs capitalize">{parsed.auth_type}</Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { setOpen(false); reset(); }}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!parsed || createServer.isPending}>
            {createServer.isPending ? 'Importing...' : 'Import Server'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigImport;
