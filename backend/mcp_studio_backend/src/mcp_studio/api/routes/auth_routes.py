# File: src/mcp_studio/api/routes/auth_routes.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm

from mcp_studio.api.controllers.auth_controller import AuthController
from mcp_studio.api.schemas.auth_schema import TokenResponse, GoogleAuthResponse
from mcp_studio.container import get_container

router = APIRouter()


@router.post("/token", response_model=TokenResponse)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController))
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    return await auth_controller.login(form_data)


@router.get("/google/auth", response_model=dict)
async def get_google_auth_url(
    server_id: str = Query(None, description="Optional server ID to associate with auth"),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController))
):
    """
    Get Google OAuth authorization URL.
    """
    return await auth_controller.get_google_auth_url(server_id)


@router.get("/google/callback", response_model=GoogleAuthResponse)
async def process_google_callback(
    code: str = Query(..., description="Authorization code from Google"),
    state: str = Query(None, description="State parameter containing server ID"),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController))
):
    """
    Process Google OAuth callback and get tokens.
    """
    return await auth_controller.process_google_callback(code, state)


@router.get("/me", response_model=dict)
async def get_current_user(
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """
    Get current user information.
    """
    return current_user