from app.core.config import settings
from app.core.security import auth_backend, fastapi_users
from app.modules.users.schemas import UserCreate, UserRead

jwt_auth_router = fastapi_users.get_auth_router(auth_backend) # type: ignore
register_router = fastapi_users.get_register_router(UserRead, UserCreate)
verify_router = fastapi_users.get_verify_router(UserRead)
reset_password_router = fastapi_users.get_reset_password_router()

AUTH_PREFIX = f"{settings.API_V1_STR}/auth/jwt"
REGISTER_PREFIX = f"{settings.API_V1_STR}/auth"
VERIFY_PREFIX = f"{settings.API_V1_STR}/auth"
RESET_PASSWORD_PREFIX = f"{settings.API_V1_STR}/auth"
