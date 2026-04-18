import os
import json
import httpx
import chromadb
from typing import AsyncGenerator

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://host.docker.internal:11434")
OLLAMA_MODEL    = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
CHROMA_PATH     = os.getenv("CHROMA_PATH", "/app/data")

_chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)

def get_collection():
    return _chroma_client.get_or_create_collection("knowledge")

def retrieve_context(query: str, n_results: int = 3) -> str:
    collection = get_collection()
    if collection.count() == 0:
        return ""
    results = collection.query(query_texts=[query], n_results=n_results)
    docs = results.get("documents", [[]])[0]
    return "\n\n".join(docs)

async def stream_response(message: str, session_id: str | None) -> AsyncGenerator[str, None]:
    context = retrieve_context(message)

    system_prompt = (
        "你是 ThanatosJun 的 AI 分身，以第一人稱口語體回應訪客。"
        "回答不超過 150 字，語氣自然親切。"
    )
    if context:
        system_prompt += f"\n\n相關背景資訊：\n{context}"

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": message,
        "system": system_prompt,
        "stream": True,
    }

    async with httpx.AsyncClient(timeout=60) as client:
        async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/generate", json=payload) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    token = data.get("response", "")
                    if token:
                        yield f'data: {json.dumps({"token": token})}\n\n'
                    if data.get("done"):
                        yield "data: [DONE]\n\n"
                        return
                except json.JSONDecodeError:
                    continue
