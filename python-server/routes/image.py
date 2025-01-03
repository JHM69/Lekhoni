from fastapi import APIRouter
from pydantic import BaseModel
from helpers.openai_image import generate_image
from utils import cloudinary

router = APIRouter()

class ImageRequest(BaseModel):
    text: str

@router.post("/")
def image_route(request: ImageRequest):
    image_url = generate_image(request.text)
    long_url = cloudinary.upload_image(image_url)
    return {"image_url": long_url}
