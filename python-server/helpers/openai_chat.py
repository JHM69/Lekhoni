from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from config import API_KEYS
import os

# Define the model
model = ChatOpenAI(model="gpt-4o", api_key=API_KEYS["openai"])

def answer_query(query="", history="", context="" ,parser=None):
    if parser is None:
        format_instructions = "give the data in plain text"
    else :
        format_instructions = parser.get_format_instructions()

    messages = []
    messages.append(HumanMessage(content=f"You are a helpful assistant. You answer user query in users prefered language"))
    if history:
        messages.append(HumanMessage(content=f"this is the chat history: {history}"))
    if context:
        messages.append(HumanMessage(content=f"this is the context: {context}"))
    
    messages.append(HumanMessage(content=f"Now answer the given query {query}. \n this is the output format: {format_instructions}"))


    response = model.invoke(messages)
    
    if parser is None:
        return response.content
    
    return parser.parse(response.content)
