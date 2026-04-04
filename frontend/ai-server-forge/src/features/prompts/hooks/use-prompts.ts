import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/features/execution/lib/db';
import type { PromptTemplate } from '../types/prompt';

export function usePrompts(serverId?: string) {
  return useLiveQuery(() => {
    if (serverId) {
      return db.prompts.where('serverId').equals(serverId).reverse().sortBy('updatedAt');
    }
    return db.prompts.orderBy('updatedAt').reverse().toArray();
  }, [serverId]);
}

export function usePrompt(id: number | undefined) {
  return useLiveQuery(() => {
    if (!id) return undefined;
    return db.prompts.get(id);
  }, [id]);
}

function extractVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(2, -2)))];
}

export async function savePrompt(prompt: Omit<PromptTemplate, 'id' | 'variables' | 'createdAt' | 'updatedAt'>) {
  const now = new Date();
  return db.prompts.add({
    ...prompt,
    variables: extractVariables(prompt.template),
    createdAt: now,
    updatedAt: now,
  });
}

export async function updatePrompt(id: number, updates: Partial<PromptTemplate>) {
  const changes: Partial<PromptTemplate> = { ...updates, updatedAt: new Date() };
  if (updates.template) {
    changes.variables = extractVariables(updates.template);
  }
  return db.prompts.update(id, changes);
}

export async function deletePrompt(id: number) {
  return db.prompts.delete(id);
}

export async function duplicatePrompt(id: number) {
  const prompt = await db.prompts.get(id);
  if (!prompt) return;
  const { id: _id, ...rest } = prompt;
  const now = new Date();
  return db.prompts.add({
    ...rest,
    name: `${rest.name} (copy)`,
    createdAt: now,
    updatedAt: now,
  });
}
