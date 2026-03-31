import yaml from 'js-yaml';
import { z } from 'zod';
import type { ServerResponse, ToolResponse } from '@/types/api';

export interface ServerExportConfig {
  name: string;
  description: string;
  connection_url: string;
  auth_type: string | null;
  tools: Array<{
    name: string;
    description: string;
    parameters: Record<string, any>;
    returns: Record<string, any>;
  }>;
  exported_at: string;
}

const serverExportSchema = z.object({
  name: z.string().min(1, 'Server name is required'),
  description: z.string().default(''),
  connection_url: z.string().min(1, 'Connection URL is required'),
  auth_type: z.string().nullable().default(null),
  tools: z.array(
    z.object({
      name: z.string(),
      description: z.string().default(''),
      parameters: z.record(z.any()).default({}),
      returns: z.record(z.any()).default({}),
    }),
  ).default([]),
  exported_at: z.string().optional(),
});

export function serializeServerConfig(
  server: ServerResponse,
  tools: ToolResponse[],
): ServerExportConfig {
  return {
    name: server.name,
    description: server.description,
    connection_url: server.connection_url,
    auth_type: server.auth_config?.type || null,
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters,
      returns: t.returns,
    })),
    exported_at: new Date().toISOString(),
  };
}

export function exportAsJSON(config: ServerExportConfig): string {
  return JSON.stringify(config, null, 2);
}

export function exportAsYAML(config: ServerExportConfig): string {
  return yaml.dump(config, { indent: 2, lineWidth: 120 });
}

export function parseImport(content: string): {
  success: true;
  config: ServerExportConfig;
} | {
  success: false;
  error: string;
} {
  let parsed: any;

  // Try JSON first
  try {
    parsed = JSON.parse(content);
  } catch {
    // Try YAML
    try {
      parsed = yaml.load(content);
    } catch (yamlErr: any) {
      return { success: false, error: 'Invalid format. Expected JSON or YAML.' };
    }
  }

  const result = serverExportSchema.safeParse(parsed);
  if (!result.success) {
    const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    return { success: false, error: `Validation failed:\n${messages.join('\n')}` };
  }

  return { success: true, config: result.data as ServerExportConfig };
}

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
