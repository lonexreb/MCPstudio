# File: src/mcp_studio/infrastructure/external/google_drive/drive_auth.py
from typing import Dict, Any, Optional

from mcp_studio.infrastructure.external.google_drive.drive_client import GoogleDriveClient


class GoogleDriveAuth:
    """Handler for Google Drive authentication."""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize with configuration.
        
        Args:
            config: Dictionary containing:
                - client_id: Google OAuth client ID
                - client_secret: Google OAuth client secret
                - redirect_uri: Redirect URI for OAuth flow
        """
        self.config = config
        self.drive_client = None
    
    def generate_oauth_config(self) -> Dict[str, Any]:
        """
        Generate OAuth configuration for an MCP server.
        
        Returns:
            Dictionary with OAuth configuration details
        """
        return {
            "type": "oauth2",
            "client_id": self.config["client_id"],
            "client_secret": self.config["client_secret"],
            "redirect_uri": self.config["redirect_uri"],
            "auth_url": "https://accounts.google.com/o/oauth2/auth",
            "token_url": "https://oauth2.googleapis.com/token",
            "scopes": [
                "https://www.googleapis.com/auth/drive.readonly",
                "https://www.googleapis.com/auth/drive.metadata.readonly"
            ]
        }
    
    def get_authorization_url(self) -> str:
        """
        Get the authorization URL for the OAuth flow.
        
        Returns:
            URL to redirect the user to for OAuth consent
        """
        self.drive_client = GoogleDriveClient({
            "client_id": self.config["client_id"],
            "client_secret": self.config["client_secret"],
            "redirect_uri": self.config["redirect_uri"]
        })
        
        return self.drive_client.get_auth_url()
    
    async def process_callback(self, code: str) -> Dict[str, Any]:
        """
        Process the OAuth callback and get tokens.
        
        Args:
            code: Authorization code from OAuth callback
            
        Returns:
            Dictionary containing access_token, refresh_token, and expiry
        """
        if not self.drive_client:
            self.drive_client = GoogleDriveClient({
                "client_id": self.config["client_id"],
                "client_secret": self.config["client_secret"],
                "redirect_uri": self.config["redirect_uri"]
            })
        
        tokens = await self.drive_client.get_tokens_from_code(code)
        
        return {
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "expires_in": tokens["expires_in"]
        }
    
    def create_auth_config(self, tokens: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create auth config object for server.
        
        Args:
            tokens: Dictionary containing access_token, refresh_token, and expires_in
            
        Returns:
            Auth config for MCP server
        """
        import time
        
        return {
            "type": "oauth2",
            "credentials": {
                "token": tokens["access_token"],
                "refresh_token": tokens["refresh_token"],
                "token_uri": "https://oauth2.googleapis.com/token",
                "client_id": self.config["client_id"],
                "client_secret": self.config["client_secret"],
                "scopes": [
                    "https://www.googleapis.com/auth/drive.readonly",
                    "https://www.googleapis.com/auth/drive.metadata.readonly"
                ],
                "expiry": int(time.time() + tokens["expires_in"])
            }
        }