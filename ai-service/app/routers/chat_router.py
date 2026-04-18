from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.chat_models import ChatRequest
from app.services.rag_service import stream_response

router = APIRouter()

@router.post("/chat")
async def chat(req: ChatRequest):
    return StreamingResponse(
        stream_response(req.message, req.session_id),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
