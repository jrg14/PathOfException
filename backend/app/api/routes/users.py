from app.core.config import settings
from app.core.security import fastapi_users
from app.modules.users.schemas import UserRead, UserUpdate

router = fastapi_users.get_users_router(UserRead, UserUpdate)
USERS_PREFIX = f"{settings.API_V1_STR}/users"
