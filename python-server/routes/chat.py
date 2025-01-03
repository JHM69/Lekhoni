from fastapi import APIRouter
from pydantic import BaseModel
from helpers.openai_chat import answer_query

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    history: str
    context: str

@router.post("/")
def chat_route(request: ChatRequest):
    response = answer_query(query=request.query, history=request.history, context=request.context)
    return {"response": response}
