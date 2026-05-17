from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()
SKILLS_PREFIX = f"{settings.API_V1_STR}/skills"


@router.get("/", tags=["skills"])
async def list_skills() -> list[dict[str, str]]:
    return []
