# File: src/mcp_studio/api/schemas/auth_schema.py
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class TokenResponse(BaseModel):
    """Schema for token response."""
    
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(..., description="Token type (bearer)")


class GoogleAuthResponse(BaseModel):
    """Schema for Google OAuth response."""
    
    access_token: str = Field(..., description="Google OAuth access token")
    refresh_token: str = Field(..., description="Google OAuth refresh token")
    expires_in: int = Field(..., description="Token expiry in seconds")
    auth_config: Dict[str, Any] = Field(..., description="Auth configuration for MCP server")


class GoogleAuthRequest(BaseModel):
    """Schema for Google OAuth request."""
    
    server_id: Optional[str] = Field(None, description="Optional server ID to associate with auth")