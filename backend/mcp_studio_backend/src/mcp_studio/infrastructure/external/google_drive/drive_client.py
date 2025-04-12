# File: src/mcp_studio/infrastructure/external/google_drive/drive_client.py
import base64
import logging
from typing import Dict, Any, Optional, List

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google_auth_oauthlib.flow import Flow

import io

logger = logging.getLogger(__name__)


class GoogleDriveClient:
    """Client for interacting with the Google Drive API."""
    
    def __init__(self, auth_config: Optional[Dict[str, Any]] = None):
        """Initialize the Google Drive client with optional auth config."""
        self.auth = None
        self.drive = None
        
        if auth_config:
            self._create_auth_client(auth_config)
    
    def _create_auth_client(self, auth_config: Dict[str, Any]) -> None:
        """Create an OAuth2 client from auth config."""
        if "credentials" in auth_config:
            creds = Credentials.from_authorized_user_info(
                auth_config["credentials"]
            )
            self.auth = creds
            self.drive = build("drive", "v3", credentials=creds)
        else:
            # Create auth client for OAuth flow
            flow = Flow.from_client_config(
                client_config={
                    "installed": {
                        "client_id": auth_config.get("client_id", ""),
                        "client_secret": auth_config.get("client_secret", ""),
                        "redirect_uris": [auth_config.get("redirect_uri", "urn:ietf:wg:oauth:2.0:oob")],
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token"
                    }
                },
                scopes=[
                    "https://www.googleapis.com/auth/drive.readonly",
                    "https://www.googleapis.com/auth/drive.metadata.readonly"
                ]
            )
            flow.redirect_uri = auth_config.get("redirect_uri", "urn:ietf:wg:oauth:2.0:oob")
            self.auth = flow
    
    def get_auth_url(self) -> str:
        """Get authentication URL for OAuth flow."""
        if not isinstance(self.auth, Flow):
            raise ValueError("Auth client not initialized for OAuth flow")
        
        auth_url, _ = self.auth.authorization_url(
            access_type="offline",
            prompt="consent"  # Force to get refresh token
        )
        return auth_url
    
    async def get_tokens_from_code(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for tokens."""
        if not isinstance(self.auth, Flow):
            raise ValueError("Auth client not initialized for OAuth flow")
        
        self.auth.fetch_token(code=code)
        creds = self.auth.credentials
        self.drive = build("drive", "v3", credentials=creds)
        
        return {
            "access_token": creds.token,
            "refresh_token": creds.refresh_token,
            "expires_in": creds._expires_in
        }
    
    async def list_files(self, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        List files in Google Drive, optionally filtered by folder.
        
        Args:
            options: Dictionary of options including:
                - folderId: ID of the folder to list files from
                - pageSize: Maximum number of files to return
                - pageToken: Token for pagination
                - orderBy: Field to sort by
                - q: Query string
                
        Returns:
            Dictionary with files and next page token
        """
        if not self.drive:
            raise ValueError("Drive client not initialized")
        
        options = options or {}
        
        # Build query
        query = []
        
        # Filter by folder if specified
        if "folderId" in options:
            query.append(f"'{options['folderId']}' in parents")
        
        # Filter by type if specified
        if "type" in options:
            if options["type"] == "folder":
                query.append("mimeType='application/vnd.google-apps.folder'")
            elif options["type"] == "file":
                query.append("mimeType!='application/vnd.google-apps.folder'")
        
        # Add custom query if specified
        if "q" in options:
            query.append(options["q"])
        
        # Build request parameters
        params = {
            "pageSize": options.get("pageSize", 100),
            "fields": "nextPageToken, files(id, name, mimeType, modifiedTime, size, webViewLink, parents)",
            "orderBy": options.get("orderBy", "modifiedTime desc")
        }
        
        if query:
            params["q"] = " and ".join(query)
        
        if "pageToken" in options:
            params["pageToken"] = options["pageToken"]
        
        # Execute request
        response = self.drive.files().list(**params).execute()
        
        return {
            "files": response.get("files", []),
            "nextPageToken": response.get("nextPageToken")
        }
    
    async def get_file(self, file_id: str) -> Dict[str, Any]:
        """
        Get file metadata.
        
        Args:
            file_id: ID of the file
            
        Returns:
            File metadata
        """
        if not self.drive:
            raise ValueError("Drive client not initialized")
        
        return self.drive.files().get(
            fileId=file_id,
            fields="id, name, mimeType, modifiedTime, size, webViewLink, parents"
        ).execute()
    
    async def download_file(self, file_id: str) -> Dict[str, Any]:
        """
        Download a file.
        
        Args:
            file_id: ID of the file
            
        Returns:
            Dictionary with file metadata and content
        """
        if not self.drive:
            raise ValueError("Drive client not initialized")
        
        # Get file metadata
        file_metadata = await self.get_file(file_id)
        
        # Download file content
        request = self.drive.files().get_media(fileId=file_id)
        file_content = io.BytesIO()
        downloader = MediaIoBaseDownload(file_content, request)
        
        done = False
        while not done:
            status, done = downloader.next_chunk()
        
        # Encode file content as base64
        file_content.seek(0)
        content_base64 = base64.b64encode(file_content.read()).decode("utf-8")
        
        return {
            **file_metadata,
            "content": content_base64
        }
    
    async def search_files(self, query: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Search for files by name or content.
        
        Args:
            query: Search query
            options: Additional options
            
        Returns:
            Dictionary with files and next page token
        """
        options = options or {}
        options["q"] = f"name contains '{query}' or fullText contains '{query}'"
        
        return await self.list_files(options)
    
    async def create_folder(self, name: str, parent_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Create a folder.
        
        Args:
            name: Folder name
            parent_id: Optional parent folder ID
            
        Returns:
            Created folder metadata
        """
        if not self.drive:
            raise ValueError("Drive client not initialized")
        
        file_metadata = {
            "name": name,
            "mimeType": "application/vnd.google-apps.folder"
        }
        
        if parent_id:
            file_metadata["parents"] = [parent_id]
        
        return self.drive.files().create(
            body=file_metadata,
            fields="id, name, mimeType, modifiedTime, webViewLink, parents"
        ).execute()