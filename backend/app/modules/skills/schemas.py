from pydantic import BaseModel


class SkillRead(BaseModel):
    id: int
    name: str
