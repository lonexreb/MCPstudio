# File: src/mcp_studio/infrastructure/external/google_drive/drive_tools.py
import logging
from typing import Dict, Any, List

from mcp_studio.infrastructure.external.google_drive.drive_client import GoogleDriveClient

logger = logging.getLogger(__name__)


class GoogleDriveTools:
    """Implementation of Google Drive MCP tools."""
    
    def __init__(self, drive_client: GoogleDriveClient):
        """
        Initialize with Google Drive client.
        
        Args:
            drive_client: Google Drive client
        """
        self.drive_client = drive_client
    
    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        """
        Get tool definitions for Google Drive.
        
        Returns:
            List of tool definitions
        """
        return [
            {
                "name": "listFiles",
                "description": "Lists files in a Google Drive folder",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "folderId": {
                            "type": "string",
                            "description": "ID of the folder to list files from (optional, defaults to root)"
                        },
                        "maxResults": {
                            "type": "integer",
                            "description": "Maximum number of files to return",
                            "default": 30
                        }
                    }
                },
                "returns": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "name": {"type": "string"},
                            "mimeType": {"type": "string"},
                            "size": {"type": "integer"},
                            "modifiedTime": {"type": "string"}
                        }
                    }
                }
            },
            {
                "name": "getFileContent",
                "description": "Retrieves the content of a file from Google Drive",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "fileId": {
                            "type": "string",
                            "description": "ID of the file to retrieve"
                        }
                    },
                    "required": ["fileId"]
                },
                "returns": {
                    "type": "object",
                    "properties": {
                        "content": {"type": "string"},
                        "mimeType": {"type": "string"},
                        "name": {"type": "string"},
                        "size": {"type": "integer"}
                    }
                }
            },
            {
                "name": "searchFiles",
                "description": "Searches for files in Google Drive",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Search query string"
                        },
                        "maxResults": {
                            "type": "integer",
                            "description": "Maximum number of results to return",
                            "default": 30
                        }
                    },
                    "required": ["query"]
                },
                "returns": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "name": {"type": "string"},
                            "mimeType": {"type": "string"},
                            "size": {"type": "integer"},
                            "modifiedTime": {"type": "string"}
                        }
                    }
                }
            },
            {
                "name": "createFolder",
                "description": "Creates a new folder in Google Drive",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "Name of the folder to create"
                        },
                        "parentId": {
                            "type": "string",
                            "description": "ID of the parent folder (optional)"
                        }
                    },
                    "required": ["name"]
                },
                "returns": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "name": {"type": "string"},
                        "mimeType": {"type": "string"}
                    }
                }
            }
        ]
    
    async def execute_tool_by_name(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a Google Drive tool by name.
        
        Args:
            tool_name: Name of the tool to execute
            parameters: Tool parameters
            
        Returns:
            Tool execution result
        """
        tool_mapping = {
            "listFiles": self.list_files,
            "getFileContent": self.get_file_content,
            "searchFiles": self.search_files,
            "createFolder": self.create_folder
        }
        
        if tool_name not in tool_mapping:
            raise ValueError(f"Unknown tool: {tool_name}")
        
        tool_function = tool_mapping[tool_name]
        return await tool_function(parameters)
    
    async def list_files(self, parameters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        List files in Google Drive.
        
        Args:
            parameters: Dictionary containing:
                - folderId: ID of the folder to list files from (optional)
                - maxResults: Maximum number of files to return
                
        Returns:
            List of file metadata
        """
        try:
            options = {
                "pageSize": parameters.get("maxResults", 30)
            }
            
            if "folderId" in parameters:
                options["folderId"] = parameters["folderId"]
            
            result = await self.drive_client.list_files(options)
            
            # Format the response
            return [
                {
                    "id": file.get("id", ""),
                    "name": file.get("name", ""),
                    "mimeType": file.get("mimeType", ""),
                    "size": int(file.get("size", 0)) if file.get("size") else None,
                    "modifiedTime": file.get("modifiedTime", "")
                }
                for file in result.get("files", [])
            ]
        except Exception as e:
            logger.error(f"Error executing listFiles tool: {e}")
            raise
    
    async def get_file_content(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get file content from Google Drive.
        
        Args:
            parameters: Dictionary containing:
                - fileId: ID of the file to retrieve
                
        Returns:
            File content and metadata
        """
        try:
            if "fileId" not in parameters:
                raise ValueError("fileId is required")
            
            file = await self.drive_client.get_file_content(parameters["fileId"])
            
            return {
                "content": file.get("content", ""),
                "mimeType": file.get("mimeType", ""),
                "name": file.get("name", ""),
                "size": int(file.get("size", 0))
            }
        except Exception as e:
            logger.error(f"Error executing getFileContent tool: {e}")
            raise
    
    async def search_files(self, parameters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Search for files in Google Drive.
        
        Args:
            parameters: Dictionary containing:
                - query: Search query string
                - maxResults: Maximum number of results to return
                
        Returns:
            List of file metadata
        """
        try:
            if "query" not in parameters:
                raise ValueError("query is required")
            
            options = {
                "pageSize": parameters.get("maxResults", 30)
            }
            
            result = await self.drive_client.search_files(parameters["query"], options)
            
            # Format the response
            return [
                {
                    "id": file.get("id", ""),
                    "name": file.get("name", ""),
                    "mimeType": file.get("mimeType", ""),
                    "size": int(file.get("size", 0)) if file.get("size") else None,
                    "modifiedTime": file.get("modifiedTime", "")
                }
                for file in result.get("files", [])
            ]
        except Exception as e:
            logger.error(f"Error executing searchFiles tool: {e}")
            raise
    
    async def create_folder(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a folder in Google Drive.
        
        Args:
            parameters: Dictionary containing:
                - name: Name of the folder to create
                - parentId: ID of the parent folder (optional)
                
        Returns:
            Created folder metadata
        """
        try:
            if "name" not in parameters:
                raise ValueError("name is required")
            
            parent_id = parameters.get("parentId")
            
            # This is a placeholder as we haven't implemented folder creation in the client
            # In a real implementation, you would call the client's createFolder method
            
            # Simulate a response for the MVP
            return {
                "id": "folder_id_placeholder",
                "name": parameters["name"],
                "mimeType": "application/vnd.google-apps.folder"
            }
        except Exception as e:
            logger.error(f"Error executing createFolder tool: {e}")
            raise