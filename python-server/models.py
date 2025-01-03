from pydantic import BaseModel, Field
from typing import Optional

# Pydantic models of food ingredient
class StoryMeta(BaseModel):
    title: str = Field(title="Title of the given text")
    summary: str= Field(title="Summary of the given text")
    tags: str = Field(title="Top tags that are associated with the given text, separated by comma")