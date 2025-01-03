from fastapi import APIRouter
from pydantic import BaseModel
from helpers.openai_text_meta import get_meta
from langchain.output_parsers import PydanticOutputParser
from models import StoryMeta
from helpers.openai_image import generate_image
from utils import cloudinary

router = APIRouter()

class BanglishRequest(BaseModel):
    text: str

@router.post("/")
def banglish_route(request: BanglishRequest):
    parser = PydanticOutputParser(pydantic_object=StoryMeta)
    meta_data = get_meta(text=request.text, parser=parser)
    image_url = generate_image(request.text)
    long_url = cloudinary.upload_image(image_url)

    meta_data_dict = meta_data.model_dump()
    meta_data_dict["thumbnail"] = long_url
    return {"meta": {
        "title": meta_data_dict["title"],
        "summary": meta_data_dict["summary"],
        "tags": meta_data_dict["tags"],
        "thumbnail": meta_data_dict["thumbnail"]
    }}
