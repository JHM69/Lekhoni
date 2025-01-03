from fastapi import APIRouter
from pydantic import BaseModel
from helpers.openai_text_meta import get_meta
from langchain.output_parsers import PydanticOutputParser
from models import StoryMeta

router = APIRouter()

class BanglishRequest(BaseModel):
    text: str

@router.post("/")
def banglish_route(request: BanglishRequest):
    parser = PydanticOutputParser(pydantic_object=StoryMeta)
    meta_data = get_meta(text=request.text, parser=parser)
    return {"meta": meta_data}
