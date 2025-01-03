from fastapi import APIRouter
from pydantic import BaseModel
from helpers.openai_banglish import convert_to_bangla

router = APIRouter()

class BanglishRequest(BaseModel):
    text: str

@router.post("/")
def banglish_route(request: BanglishRequest):
    translated_text = convert_to_bangla(request.text)
    return {"translated_text": translated_text}
