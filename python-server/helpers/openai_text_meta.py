from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from config import API_KEYS
import os

# Define the model
model = ChatOpenAI(model="gpt-4o", api_key=API_KEYS["openai"])

def get_meta(text, parser=None):
    if parser is None:
        format_instructions = "give the data in plain text"
    else :
        format_instructions = parser.get_format_instructions()

    message = HumanMessage(
        content=f"You are SEO specialist. Generate meta data of the given text: {text}. \n this is the output format: {format_instructions}"
    )

    response = model.invoke([message])
    
    if parser is None:
        return response.content
    
    return parser.parse(response.content)
