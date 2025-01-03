from fastapi import FastAPI
from routes import banglish, improve, chat
import dotenv
dotenv.load_dotenv()

app = FastAPI()

# Include the ingredients router
app.include_router(banglish.router, prefix="/banglish", tags=["Banglish"])
app.include_router(improve.router, prefix="/improve", tags=["Improve"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)

