import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { PromptTemplate } from '../types/prompt';

interface PromptEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt?: PromptTemplate | null;
  onSave: (data: { name: string; description: string; template: string; tags: string[]; serverId?: string; toolId?: string }) => void;
}

const PromptEditor = ({ open, onOpenChange, prompt, onSave }: PromptEditorProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (prompt) {
      setName(prompt.name);
      setDescription(prompt.description);
      setTemplate(prompt.template);
      setTags(prompt.tags);
    } else {
      setName('');
      setDescription('');
      setTemplate('');
      setTags([]);
    }
    setTagInput('');
  }, [prompt, open]);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    if (!name.trim() || !template.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), template, tags });
    onOpenChange(false);
  };

  // Highlight {{variables}} in the template
  const variableCount = (template.match(/\{\{\w+\}\}/g) || []).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{prompt ? 'Edit Prompt' : 'New Prompt Template'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="prompt-name">Name</Label>
            <Input id="prompt-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Summarize File" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt-desc">Description</Label>
            <Input id="prompt-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this prompt does..." />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="prompt-template">Template</Label>
              {variableCount > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  {variableCount} variable{variableCount !== 1 ? 's' : ''} detected
                </span>
              )}
            </div>
            <Textarea
              id="prompt-template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder={"Use {{variable_name}} for dynamic values.\n\nExample: Summarize the file at {{file_path}} in {{language}}."}
              className="font-mono text-sm min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tag and press Enter"
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={handleAddTag} disabled={!tagInput.trim()}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs gap-1 pr-1">
                    {tag}
                    <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="ml-0.5 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim() || !template.trim()} className="gradient-brand">
            {prompt ? 'Save Changes' : 'Create Prompt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptEditor;
