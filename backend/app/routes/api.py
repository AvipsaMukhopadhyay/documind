from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.models.schemas import UploadResponse, SummarizeRequest, AnalysisResponse, HealthResponse
from app.services.document_processor import DocumentProcessor
from app.services.llm_service import LLMService
from app.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="ok")

@router.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    max_size = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    content = await file.read()

    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty."
        )

    if len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB."
        )

    try:
        result = await DocumentProcessor.process_document(
            filename=file.filename or "unknown_file",
            content=content,
            mime_type=file.content_type or "application/octet-stream"
        )
        return UploadResponse(
            filename=result["filename"],
            file_type=result["file_type"],
            pages=result["pages"],
            text=result["text"],
            message="Document text extracted successfully."
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ve))
    except RuntimeError as re:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(re))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected processing error: {str(e)}")

@router.post("/summarize", response_model=AnalysisResponse)
async def summarize_document(payload: SummarizeRequest):
    try:
        llm = LLMService()
        result = await llm.analyze_document(payload.text, payload.summary_length)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"AI Summarization failed: {str(e)}")