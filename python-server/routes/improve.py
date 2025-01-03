from fastapi import APIRouter
from pydantic import BaseModel
from helpers.openai_improve_bangla import improve_text

router = APIRouter()

class ImproveRequest(BaseModel):
    text: str

@router.post("/")
def improve_route(request: ImproveRequest):
    improved_text = improve_text(request.text)
    return {"improved_text": improved_text}
