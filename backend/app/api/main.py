from fastapi import APIRouter

from app.api.routes import auth, skills, users

api_router = APIRouter()
api_router.include_router(auth.jwt_auth_router, prefix=auth.AUTH_PREFIX, tags=["auth"])
api_router.include_router(auth.register_router, prefix=auth.REGISTER_PREFIX, tags=["auth"])
api_router.include_router(auth.verify_router, prefix=auth.VERIFY_PREFIX, tags=["auth"])
api_router.include_router(
    auth.reset_password_router,
    prefix=auth.RESET_PASSWORD_PREFIX,
    tags=["auth"],
)
api_router.include_router(users.router, prefix=users.USERS_PREFIX, tags=["users"])
api_router.include_router(skills.router, prefix=skills.SKILLS_PREFIX, tags=["skills"])
