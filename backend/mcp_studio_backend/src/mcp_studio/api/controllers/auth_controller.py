# File: src/mcp_studio/api/controllers/auth_controller.py
import logging
from typing import Dict, Any

from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import ValidationError

from mcp_studio.api.schemas.auth_schema import TokenResponse, GoogleAuthResponse
from mcp_studio.application.services.auth_service import AuthService
from mcp_studio.config.settings import settings
from mcp_studio.domain.models.server import Server
from mcp_studio.domain.repositories.server_repository import ServerRepository

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


class AuthController:
    """Controller for authentication-related endpoints."""
    
    def __init__(
        self,
        auth_service: AuthService,
        server_repository: ServerRepository
    ):
        self.auth_service = auth_service
        self.server_repository = server_repository
    
    async def login(self, form_data: OAuth2PasswordRequestForm) -> TokenResponse:
        """
        Authenticate a user with username and password.
        
        Args:
            form_data: Form containing username and password
            
        Returns:
            Access token and token type
        """
        # For MVP, we'll use a simple hardcoded authentication
        # In a real application, you would verify against a user database
        if form_data.username != "admin" or not self.auth_service.verify_password(form_data.password, 
                                                                                   self.auth_service.get_password_hash("password")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token = self.auth_service.create_access_token(
            data={"sub": form_data.username}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer"
        )
    
    async def get_google_auth_url(self, server_id: str = None) -> Dict[str, str]:
        """
        Get Google OAuth authorization URL.
        
        Args:
            server_id: Optional server ID to associate with auth
            
        Returns:
            Dictionary with auth URL and state
        """
        auth_url = self.auth_service.get_google_auth_url()
        
        return {
            "auth_url": auth_url,
            "state": server_id or ""
        }
    
    async def process_google_callback(self, code: str, state: str = None) -> GoogleAuthResponse:
        """
        Process Google OAuth callback.
        
        Args:
            code: Authorization code
            state: Optional state containing server ID
            
        Returns:
            Auth response with tokens and auth configuration
        """
        try:
            result = await self.auth_service.process_google_callback(code)
            
            # If state contains a server ID, update the server's auth config
            if state and state.strip():
                try:
                    server = await self.server_repository.find_by_id(state)
                    if server:
                        server.set_auth_config(result["auth_config"])
                        await self.server_repository.save(server)
                except Exception as e:
                    logger.error(f"Error updating server auth config: {e}")
            
            return GoogleAuthResponse(
                access_token=result["tokens"]["access_token"],
                refresh_token=result["tokens"]["refresh_token"],
                expires_in=result["tokens"]["expires_in"],
                auth_config=result["auth_config"]
            )
        except Exception as e:
            logger.error(f"Error processing Google callback: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error processing Google callback: {str(e)}"
            )
    
    async def get_current_user(self, token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
        """
        Get the current authenticated user from JWT token.
        
        Args:
            token: JWT token
            
        Returns:
            User information
        """
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            payload = jwt.decode(
                token, 
                settings.secret_key, 
                algorithms=[settings.algorithm]
            )
            username: str = payload.get("sub")
            
            if username is None:
                raise credentials_exception
            
        except (JWTError, ValidationError):
            raise credentials_exception
        
        # For MVP, we'll return a simple user object
        # In a real application, you would fetch the user from a database
        return {"id": "1", "username": username}