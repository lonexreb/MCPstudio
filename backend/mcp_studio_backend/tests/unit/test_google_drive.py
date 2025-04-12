# File: tests/unit/test_google_drive.py
import unittest
from unittest.mock import MagicMock, patch, AsyncMock
import pytest
from typing import Dict, Any

from mcp_studio.infrastructure.external.google_drive.drive_client import GoogleDriveClient
from mcp_studio.infrastructure.external.google_drive.drive_tools import GoogleDriveTools
from mcp_studio.infrastructure.external.google_drive.drive_auth import GoogleDriveAuth


class TestGoogleDriveAuth(unittest.TestCase):
    """Test cases for Google Drive authentication."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.config = {
            "client_id": "test-client-id",
            "client_secret": "test-client-secret",
            "redirect_uri": "http://localhost:8000/api/auth/google/callback"
        }
        self.auth = GoogleDriveAuth(self.config)
    
    def test_generate_oauth_config(self):
        """Test generating OAuth configuration."""
        oauth_config = self.auth.generate_oauth_config()
        
        self.assertEqual(oauth_config["type"], "oauth2")
        self.assertEqual(oauth_config["client_id"], self.config["client_id"])
        self.assertEqual(oauth_config["client_secret"], self.config["client_secret"])
        self.assertEqual(oauth_config["redirect_uri"], self.config["redirect_uri"])
        self.assertIn("https://www.googleapis.com/auth/drive.readonly", oauth_config["scopes"])
    
    def test_get_authorization_url(self):
        """Test getting authorization URL."""
        # Call method
        auth_url = self.auth.get_authorization_url()
        
        # Verify
        self.assertTrue(auth_url.startswith("https://accounts.google.com/o/oauth2/auth"))
        self.assertIn("response_type=code", auth_url)
        self.assertIn("client_id=test-client-id", auth_url)
        self.assertIn("redirect_uri=", auth_url)
        self.assertIn("access_type=offline", auth_url)
    
    @patch("mcp_studio.infrastructure.external.google_drive.drive_client.GoogleDriveClient")
    @pytest.mark.asyncio
    async def test_process_callback(self, mock_client):
        """Test processing OAuth callback."""
        # Setup mock
        mock_instance = MagicMock()
        mock_instance.get_tokens_from_code = AsyncMock(return_value={
            "access_token": "test-access-token",
            "refresh_token": "test-refresh-token",
            "expires_in": 3600
        })
        mock_client.return_value = mock_instance
        
        # Call method
        tokens = await self.auth.process_callback("test-code")
        
        # Verify
        self.assertEqual(tokens["access_token"], "test-access-token")
        self.assertEqual(tokens["refresh_token"], "test-refresh-token")
        self.assertEqual(tokens["expires_in"], 3600)
        mock_instance.get_tokens_from_code.assert_called_once_with("test-code")
    
    def test_create_auth_config(self):
        """Test creating auth config from tokens."""
        tokens = {
            "access_token": "test-access-token",
            "refresh_token": "test-refresh-token",
            "expires_in": 3600
        }
        
        auth_config = self.auth.create_auth_config(tokens)
        
        self.assertEqual(auth_config["type"], "oauth2")
        self.assertEqual(auth_config["credentials"]["token"], tokens["access_token"])
        self.assertEqual(auth_config["credentials"]["refresh_token"], tokens["refresh_token"])
        self.assertEqual(auth_config["credentials"]["client_id"], self.config["client_id"])
        self.assertEqual(auth_config["credentials"]["client_secret"], self.config["client_secret"])


class TestGoogleDriveTools(unittest.TestCase):
    """Test cases for Google Drive tools."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_client = MagicMock()
        self.tools = GoogleDriveTools(self.mock_client)
    
    def test_get_tool_definitions(self):
        """Test getting tool definitions."""
        tool_defs = self.tools.get_tool_definitions()
        
        self.assertIsInstance(tool_defs, list)
        self.assertTrue(len(tool_defs) > 0)
        
        # Check that each tool definition has required fields
        for tool in tool_defs:
            self.assertIn("name", tool)
            self.assertIn("description", tool)
            self.assertIn("parameters", tool)
            self.assertIn("returns", tool)
    
    @pytest.mark.asyncio
    async def test_execute_tool_by_name_list_files(self):
        """Test executing listFiles tool."""
        # Setup mock
        self.mock_client.list_files = AsyncMock(return_value={
            "files": [
                {"id": "file1", "name": "File 1"},
                {"id": "file2", "name": "File 2"}
            ]
        })
        
        # Call method
        result = await self.tools.execute_tool_by_name("listFiles", {"maxResults": 10})
        
        # Verify
        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 2)
        self.mock_client.list_files.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_execute_tool_by_name_get_file_content(self):
        """Test executing getFileContent tool."""
        # Setup mock
        self.mock_client.download_file = AsyncMock(return_value={
            "id": "file1",
            "name": "File 1",
            "mimeType": "text/plain",
            "content": "base64content"
        })
        
        # Call method
        result = await self.tools.execute_tool_by_name("getFileContent", {"fileId": "file1"})
        
        # Verify
        self.assertIsInstance(result, dict)
        self.assertEqual(result["name"], "File 1")
        self.assertEqual(result["content"], "base64content")
        self.mock_client.download_file.assert_called_once_with("file1")
    
    @pytest.mark.asyncio
    async def test_execute_tool_by_name_search_files(self):
        """Test executing searchFiles tool."""
        # Setup mock
        self.mock_client.search_files = AsyncMock(return_value={
            "files": [
                {"id": "file1", "name": "File 1"},
                {"id": "file2", "name": "File 2"}
            ]
        })
        
        # Call method
        result = await self.tools.execute_tool_by_name("searchFiles", {"query": "test"})
        
        # Verify
        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 2)
        self.mock_client.search_files.assert_called_once_with("test", {"query": "test"})
    
    @pytest.mark.asyncio
    async def test_execute_tool_by_name_create_folder(self):
        """Test executing createFolder tool."""
        # Setup mock
        self.mock_client.create_folder = AsyncMock(return_value={
            "id": "folder1",
            "name": "Folder 1",
            "mimeType": "application/vnd.google-apps.folder"
        })
        
        # Call method
        result = await self.tools.execute_tool_by_name("createFolder", {"name": "Folder 1"})
        
        # Verify
        self.assertIsInstance(result, dict)
        self.assertEqual(result["id"], "folder1")
        self.assertEqual(result["name"], "Folder 1")
        self.mock_client.create_folder.assert_called_once_with("Folder 1", None)
    
    @pytest.mark.asyncio
    async def test_execute_tool_by_name_unknown_tool(self):
        """Test executing an unknown tool."""
        with self.assertRaises(ValueError):
            await self.tools.execute_tool_by_name("unknownTool", {})


if __name__ == "__main__":
    unittest.main()
