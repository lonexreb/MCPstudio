
// MCP Domain Model Types

export type DeploymentState = 'NOT_DEPLOYED' | 'DEPLOYING' | 'DEPLOYED' | 'FAILED';

export interface Parameter {
  name: string;
  description: string;
  type: string; // can be 'string', 'number', 'boolean', 'object', 'array', etc.
  required: boolean;
  schema?: Record<string, any>; // JSON Schema for complex types
}

export interface ReturnType {
  type: string;
  description: string;
  schema?: Record<string, any>; // JSON Schema for complex types
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  parameters: Parameter[];
  returnType: ReturnType;
  implementation?: string; // Code implementation
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  type: 'static' | 'database' | 'api' | 'streaming' | 'ai';
  config: Record<string, any>;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
}

export interface ServerConfiguration {
  transport: 'http' | 'websocket' | 'both';
  authentication: {
    type: 'none' | 'apiKey' | 'oauth' | 'jwt';
    config: Record<string, any>;
  };
  cors: {
    enabled: boolean;
    origins: string[];
  };
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
  resources: Resource[];
  prompts: PromptTemplate[];
  config: ServerConfiguration;
  deploymentState: DeploymentState;
  deploymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Sample data for demo purposes
export const sampleTools: Tool[] = [
  {
    id: 'tool-1',
    name: 'searchDocuments',
    description: 'Search documents with natural language queries',
    parameters: [
      {
        name: 'query',
        description: 'Natural language search query',
        type: 'string',
        required: true,
      },
      {
        name: 'limit',
        description: 'Maximum number of results to return',
        type: 'number',
        required: false,
      }
    ],
    returnType: {
      type: 'array',
      description: 'Array of document search results',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            relevance: { type: 'number' }
          }
        }
      }
    },
    implementation: `async function searchDocuments(query, limit = 10) {
  // In a real implementation, this would connect to a search engine or database
  console.log("Searching for:", query, "with limit:", limit);
  
  // Mock implementation returning fake results
  return [
    {
      title: "Sample Document 1",
      content: "This is content that might match the query",
      relevance: 0.95
    },
    {
      title: "Sample Document 2",
      content: "Another matching document with different content",
      relevance: 0.85
    }
  ].slice(0, limit);
}`
  },
  {
    id: 'tool-2',
    name: 'getWeather',
    description: 'Get current weather information for a location',
    parameters: [
      {
        name: 'location',
        description: 'City name or geographic coordinates',
        type: 'string',
        required: true,
      }
    ],
    returnType: {
      type: 'object',
      description: 'Weather information',
      schema: {
        type: 'object',
        properties: {
          temperature: { type: 'number' },
          condition: { type: 'string' },
          humidity: { type: 'number' },
          windSpeed: { type: 'number' }
        }
      }
    },
    implementation: `async function getWeather(location) {
  // In a real implementation, this would call a weather API
  console.log("Getting weather for:", location);
  
  // Mock implementation
  return {
    temperature: 22.5,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12
  };
}`
  }
];

export const sampleResources: Resource[] = [
  {
    id: 'resource-1',
    name: 'documentDatabase',
    description: 'Vector database containing document embeddings',
    type: 'database',
    config: {
      connectionString: 'postgresql://user:password@localhost:5432/documents',
      tables: ['documents', 'embeddings']
    }
  },
  {
    id: 'resource-2',
    name: 'weatherAPI',
    description: 'External weather data service',
    type: 'api',
    config: {
      baseUrl: 'https://api.weather.example',
      apiKey: 'PLACEHOLDER_API_KEY'
    }
  }
];

export const samplePrompts: PromptTemplate[] = [
  {
    id: 'prompt-1',
    name: 'searchQueryEnhancer',
    description: 'Improves search queries for more accurate results',
    template: 'Enhance the following search query to improve document retrieval: "{{query}}"',
    variables: ['query']
  }
];

export const sampleServers: MCPServer[] = [
  {
    id: 'server-1',
    name: 'Document Search Engine',
    description: 'MCP server for intelligent document search and retrieval',
    tools: sampleTools.slice(0, 1),
    resources: sampleResources.slice(0, 1),
    prompts: samplePrompts,
    config: {
      transport: 'http',
      authentication: {
        type: 'apiKey',
        config: {
          header: 'X-API-Key'
        }
      },
      cors: {
        enabled: true,
        origins: ['*']
      }
    },
    deploymentState: 'DEPLOYED',
    deploymentUrl: 'https://document-search.example.mcp',
    createdAt: '2025-02-15T10:30:00Z',
    updatedAt: '2025-04-01T14:45:00Z'
  },
  {
    id: 'server-2',
    name: 'Weather Information Service',
    description: 'MCP server providing accurate weather data for AI agents',
    tools: sampleTools.slice(1, 2),
    resources: sampleResources.slice(1, 2),
    prompts: [],
    config: {
      transport: 'http',
      authentication: {
        type: 'none',
        config: {}
      },
      cors: {
        enabled: true,
        origins: ['*']
      }
    },
    deploymentState: 'NOT_DEPLOYED',
    createdAt: '2025-03-22T09:15:00Z',
    updatedAt: '2025-03-22T09:15:00Z'
  },
];

// Function to create a new MCP server
export function createNewServer(): MCPServer {
  return {
    id: `server-${Date.now()}`,
    name: 'New MCP Server',
    description: 'A new MCP server for AI agent integration',
    tools: [],
    resources: [],
    prompts: [],
    config: {
      transport: 'http',
      authentication: {
        type: 'none',
        config: {}
      },
      cors: {
        enabled: true,
        origins: ['*']
      }
    },
    deploymentState: 'NOT_DEPLOYED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
