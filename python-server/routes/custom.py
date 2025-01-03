from fastapi import APIRouter, HTTPException
from utils.model import Translator

router = APIRouter()
translator = Translator()

@router.post("/")
async def translate_text(text: str):
    if not text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")
    try:
        translated_text = translator.translate_text(text)
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
