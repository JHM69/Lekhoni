from fastapi import APIRouter, HTTPException
from utils.model import Translator

router = APIRouter()
translator = Translator()

@router.post("/translate/")
async def translate_text(input_text: str):
    if not input_text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")
    try:
        translated_text = translator.translate_text(input_text)
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
