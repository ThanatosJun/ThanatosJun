import os
import httpx
import chromadb

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://host.docker.internal:11434")
OLLAMA_MODEL    = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
CHROMA_PATH     = os.getenv("CHROMA_PATH", "/app/data")

_chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)

async def ingest_document(doc_id: str, content: str, metadata: dict | None = None):
    collection = _chroma_client.get_or_create_collection("knowledge")
    collection.upsert(
        ids=[doc_id],
        documents=[content],
        metadatas=[metadata or {}],
    )
