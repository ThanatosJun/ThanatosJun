from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.routers import chat_router

app = FastAPI(title="ThanatosJun AI Service")
app.include_router(chat_router.router)
