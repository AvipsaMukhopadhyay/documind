import io
import fitz  # PyMuPDF
from PIL import Image
from app.services.ocr_service import OCRService

class DocumentProcessor:
    ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/jpg"}
    ALLOWED_PDF_TYPES = {"application/pdf"}

    @classmethod
    async def process_document(cls, filename: str, content: bytes, mime_type: str) -> dict:
        if mime_type in cls.ALLOWED_PDF_TYPES or filename.lower().endswith(".pdf"):
            return cls._process_pdf(content, filename)
        elif mime_type in cls.ALLOWED_IMAGE_TYPES or any(filename.lower().endswith(ext) for ext in [".png", ".jpg", ".jpeg"]):
            return cls._process_image(content, filename, mime_type)
        else:
            raise ValueError(f"Unsupported file type '{mime_type}'. Supported: PDF, PNG, JPG, JPEG.")

    @staticmethod
    def _process_pdf(content: bytes, filename: str) -> dict:
        try:
            doc = fitz.open(stream=content, filetype="pdf")
        except Exception:
            raise ValueError("Corrupted or unreadable PDF document.")

        total_pages = len(doc)
        if total_pages == 0:
            doc.close()
            raise ValueError("The provided PDF file is empty.")

        extracted_pages = []
        is_scanned_document = False

        for page_num in range(total_pages):
            page = doc[page_num]
            text = page.get_text("text").strip()
            
            # If standard text extraction yields minimal text, fallback to OCR
            if len(text) < 40:
                pix = page.get_pixmap(dpi=200)
                try:
                    ocr_text = OCRService.extract_text_from_image_bytes(pix.tobytes("png"))
                    text = ocr_text.strip()
                    is_scanned_document = True
                except Exception:
                    pass

            if text:
                extracted_pages.append(f"--- Page {page_num + 1} ---\n" + text)

        full_text = "\n\n".join(extracted_pages).strip()
        doc.close()

        if not full_text:
            raise ValueError("Could not extract any recognizable text from this PDF (empty or illegible).")

        return {
            "filename": filename,
            "file_type": "Scanned PDF (OCR)" if is_scanned_document else "Native PDF",
            "pages": total_pages,
            "text": full_text
        }

    @staticmethod
    def _process_image(content: bytes, filename: str, mime_type: str) -> dict:
        text = OCRService.extract_text_from_image_bytes(content)
        if not text:
            raise ValueError("No recognizable text was found in the uploaded image.")

        return {
            "filename": filename,
            "file_type": mime_type.split("/")[-1].upper(),
            "pages": 1,
            "text": text
        }