from pydantic import BaseModel

class KnowledgeChunk(BaseModel):
    id: str
    content: str
    metadata: dict
