from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from config import API_KEYS
import os

# Define the model
model = ChatOpenAI(model="gpt-4o", api_key=API_KEYS["openai"])

def convert_to_bangla(text, parser=None):
    if parser is None:
        format_instructions = "give the data in plain text"
    else :
        format_instructions = parser.get_format_instructions()

    message = HumanMessage(
        content=f"Translate the following text to Bangla: {text}. Do not alter any word. {format_instructions}"
    )

    response = model.invoke([message])
    
    if parser is None:
        return response.content
    
    return parser.parse(response.content)
