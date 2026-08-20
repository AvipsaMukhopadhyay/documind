from enum import Enum
from pydantic import BaseModel, Field
from typing import List

class SummaryLength(str, Enum):
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"

class UploadResponse(BaseModel):
    filename: str
    file_type: str
    pages: int
    text: str
    message: str

class SummarizeRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Extracted document text to analyze")
    summary_length: SummaryLength = Field(default=SummaryLength.MEDIUM)

class AnalysisResponse(BaseModel):
    summary: str
    key_points: List[str]
    main_ideas: List[str]
    improvement_suggestions: List[str]

class HealthResponse(BaseModel):
    status: str
