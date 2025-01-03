from pydantic import BaseModel
from typing import Optional

# Pydantic models of food ingredient
class IngredientBase(BaseModel):
    name: str
    quantity: str
    unit: Optional[str] = None
    calories: Optional[int] = 0
    category: Optional[str] = None



# pydantic models of recipe
class RecipeBase(BaseModel):
    name: str
    description: Optional[str] = None
    ingredients: Optional[list[str]] = None
    taste: Optional[str] = None
    reviews: Optional[int] = 0
    cuisine: Optional[str] = None
    preparation_time: Optional[str] = None
    instructions: Optional[str] = None