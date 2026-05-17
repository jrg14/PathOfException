from fastapi import FastAPI

from app.api.main import api_router
from app.core.config import settings
from app.db.session import create_db_and_tables
from app.modules.skills.models import Skill  # noqa: F401
from app.modules.users.models import User  # noqa: F401
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(api_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    if settings.AUTO_CREATE_TABLES:
        await create_db_and_tables()


@app.get("/health-check", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
