import React, { useState, useMemo } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  serializeServerConfig,
  exportAsJSON,
  exportAsYAML,
  downloadFile,
  type ServerExportConfig,
} from '../lib/config-serializer';
import type { ServerResponse, ToolResponse } from '@/types/api';

interface ConfigExportProps {
  server: ServerResponse;
  tools: ToolResponse[];
}

const ConfigExport = ({ server, tools }: ConfigExportProps) => {
  const [format, setFormat] = useState<'json' | 'yaml'>('json');
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const config = useMemo(() => serializeServerConfig(server, tools), [server, tools]);
  const content = useMemo(
    () => (format === 'json' ? exportAsJSON(config) : exportAsYAML(config)),
    [config, format],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'json' ? 'json' : 'yaml';
    const filename = `${server.name.replace(/\s+/g, '-').toLowerCase()}.${ext}`;
    downloadFile(content, filename);
    toast.success(`Downloaded ${filename}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Server Configuration</DialogTitle>
          <DialogDescription>
            Export "{server.name}" configuration for sharing or backup. Credentials are not included.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label className="text-sm">Format:</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'json' | 'yaml')} className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="json" id="fmt-json" />
                <Label htmlFor="fmt-json" className="text-sm">JSON</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="yaml" id="fmt-yaml" />
                <Label htmlFor="fmt-yaml" className="text-sm">YAML</Label>
              </div>
            </RadioGroup>
          </div>

          <ScrollArea className="h-72 border rounded-md">
            <pre className="p-4 text-xs font-mono">{content}</pre>
          </ScrollArea>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigExport;
