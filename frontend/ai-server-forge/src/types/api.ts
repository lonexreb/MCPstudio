// API types matching backend Pydantic schemas exactly

// --- Auth ---

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface GoogleAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  auth_config: Record<string, any>;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
}

// --- Server ---

export interface AuthConfigSchema {
  type: string;
  credentials: Record<string, any>;
}

export interface ServerCreate {
  name: string;
  description: string;
  connection_url: string;
  auth_config?: AuthConfigSchema | null;
}

export interface ServerUpdate {
  name?: string;
  description?: string;
  connection_url?: string;
  status?: string;
  auth_config?: AuthConfigSchema | null;
}

export interface ToolReference {
  id: string;
  name: string;
  description: string;
}

export interface ServerResponse {
  id: string;
  name: string;
  description: string;
  connection_url: string;
  status: string;
  tools: ToolReference[];
  auth_config: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface ServerListResponse {
  servers: ServerResponse[];
  total: number;
}

// --- Tool ---

export interface ToolResponse {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  returns: Record<string, any>;
}

export interface ToolListResponse {
  tools: ToolResponse[];
}

export interface ToolWithServerResponse {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  returns: Record<string, any>;
  server_id: string;
  server_name: string;
}

export interface AllToolsListResponse {
  tools: ToolWithServerResponse[];
}

export interface ToolExecutionRequest {
  parameters: Record<string, any>;
}

export interface ToolExecutionResponse {
  tool_id: string;
  parameters: Record<string, any>;
  result: Record<string, any>;
  status: 'success' | 'error';
  execution_time: number;
}
