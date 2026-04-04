import { useState, useMemo } from 'react';
import { Lightbulb, PlusCircle, Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { usePrompts, savePrompt, updatePrompt, deletePrompt, duplicatePrompt } from '../hooks/use-prompts';
import PromptCard from '../components/PromptCard';
import PromptEditor from '../components/PromptEditor';
import type { PromptTemplate } from '../types/prompt';

const PromptsPage = () => {
  const prompts = usePrompts();
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    if (!prompts) return [];
    if (!search) return prompts;
    const q = search.toLowerCase();
    return prompts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)),
    );
  }, [prompts, search]);

  const handleNew = () => {
    setEditingPrompt(null);
    setEditorOpen(true);
  };

  const handleEdit = (prompt: PromptTemplate) => {
    setEditingPrompt(prompt);
    setEditorOpen(true);
  };

  const handleSave = async (data: { name: string; description: string; template: string; tags: string[] }) => {
    if (editingPrompt?.id) {
      await updatePrompt(editingPrompt.id, data);
      toast({ title: 'Prompt updated' });
    } else {
      await savePrompt(data);
      toast({ title: 'Prompt created' });
    }
  };

  const handleDelete = async (id: number) => {
    await deletePrompt(id);
    toast({ title: 'Prompt deleted' });
  };

  const handleDuplicate = async (id: number) => {
    await duplicatePrompt(id);
    toast({ title: 'Prompt duplicated' });
  };

  return (
    <MainLayout title="Prompt Templates" subtitle="Create reusable prompt patterns for tool execution">
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl p-6 gradient-sunset shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Prompt Templates</h2>
                <p className="text-white/70 text-sm">
                  {prompts ? `${prompts.length} template${prompts.length !== 1 ? 's' : ''}` : 'Loading...'}
                </p>
              </div>
            </div>
            <Button onClick={handleNew} className="gradient-brand shadow-lg">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              New Prompt
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Content */}
        {prompts === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-border/50 rounded-xl p-12 text-center">
            <Lightbulb className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">
              {prompts.length === 0 ? 'No prompts yet' : 'No matching prompts'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {prompts.length === 0
                ? 'Create your first prompt template to get started.'
                : 'Try adjusting your search.'}
            </p>
            {prompts.length === 0 && (
              <Button onClick={handleNew} variant="outline">
                <PlusCircle className="h-4 w-4 mr-1.5" />
                Create Prompt
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}

        <PromptEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          prompt={editingPrompt}
          onSave={handleSave}
        />
      </div>
    </MainLayout>
  );
};

export default PromptsPage;
