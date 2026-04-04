export interface PromptTemplate {
  id?: number;
  name: string;
  description: string;
  template: string;
  variables: string[];
  toolId?: string;
  serverId?: string;
  tags: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
