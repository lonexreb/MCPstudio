import { Lightbulb, Copy, Trash2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PromptTemplate } from '../types/prompt';

interface PromptCardProps {
  prompt: PromptTemplate;
  onEdit: (prompt: PromptTemplate) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
}

const PromptCard = ({ prompt, onEdit, onDelete, onDuplicate }: PromptCardProps) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-[1px]" />
      <div className="relative p-4 rounded-xl bg-card border border-border/50 hover:border-transparent transition-all space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate">{prompt.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{prompt.description || 'No description'}</p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(prompt)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => prompt.id && onDuplicate(prompt.id)}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => prompt.id && onDelete(prompt.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <pre className="text-xs bg-secondary/30 rounded-md p-2 overflow-hidden text-ellipsis whitespace-pre-wrap max-h-20 font-mono text-muted-foreground">
          {prompt.template}
        </pre>

        <div className="flex items-center gap-2 flex-wrap">
          {prompt.variables.length > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {prompt.variables.length} variable{prompt.variables.length !== 1 ? 's' : ''}
            </Badge>
          )}
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
