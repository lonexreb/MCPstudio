# File: src/mcp_studio/application/services/auth_service.py
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

from jose import jwt
from passlib.context import CryptContext

from mcp_studio.config.settings import settings
from mcp_studio.infrastructure.external.google_drive.drive_auth import GoogleDriveAuth

logger = logging.getLogger(__name__)


class AuthService:
    """Service for handling authentication and authorization."""
    
    def __init__(self):
        """Initialize the auth service with password context."""
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        # Initialize Google Drive auth with config from settings
        self.google_drive_auth = GoogleDriveAuth({
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "redirect_uri": settings.google_redirect_uri
        })
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against a hash.
        
        Args:
            plain_password: The plain-text password
            hashed_password: The hashed password
            
        Returns:
            True if the password matches, False otherwise
        """
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """
        Hash a password.
        
        Args:
            password: The plain-text password
            
        Returns:
            The hashed password
        """
        return self.pwd_context.hash(password)
    
    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """
        Create a JWT access token.
        
        Args:
            data: The data to encode in the token
            expires_delta: Optional expiration delta
            
        Returns:
            The JWT token
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.secret_key, 
            algorithm=settings.algorithm
        )
        
        return encoded_jwt
    
    # Google Drive OAuth methods
    
    def get_google_auth_url(self) -> str:
        """
        Get Google OAuth authorization URL.
        
        Returns:
            URL to redirect the user to for Google OAuth
        """
        return self.google_drive_auth.get_authorization_url()
    
    async def process_google_callback(self, code: str) -> Dict[str, Any]:
        """
        Process Google OAuth callback and get tokens.
        
        Args:
            code: Authorization code from OAuth callback
            
        Returns:
            Dictionary containing tokens and auth configuration
        """
        try:
            # Get tokens from Google
            tokens = await self.google_drive_auth.process_callback(code)
            
            # Create auth config for MCP server
            auth_config = self.google_drive_auth.create_auth_config(tokens)
            
            return {
                "tokens": tokens,
                "auth_config": auth_config
            }
        except Exception as e:
            logger.error(f"Error processing Google callback: {e}")
            raise
    
    def create_google_auth_config(self, tokens: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create Google auth config from tokens.
        
        Args:
            tokens: OAuth tokens
            
        Returns:
            Auth config for MCP server
        """
        return self.google_drive_auth.create_auth_config(tokens)