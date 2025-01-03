import os

API_KEYS = {
    "google": os.getenv("GOOGLE_API_KEY"),
    "openai": os.getenv("OPENAI_API_KEY")
}
