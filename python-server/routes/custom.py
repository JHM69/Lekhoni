from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.model import Translator

router = APIRouter()
translator = Translator()

class CustomRequest(BaseModel):
    text: str

@router.post("/")
async def translate_text(request: CustomRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")
    try:
        translated_text = translator.translate_text(request.text)
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
