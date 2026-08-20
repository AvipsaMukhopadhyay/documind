import io
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
from app.config import settings

if settings.TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

class OCRService:
    @staticmethod
    def preprocess_image(image: Image.Image) -> Image.Image:
        """
        Applies grayscale, contrast enhancement, and adaptive thresholding for OCR clarity.
        """
        gray = image.convert("L")
        enhancer = ImageEnhance.Contrast(gray)
        enhanced = enhancer.enhance(1.8)
        sharpened = enhanced.filter(ImageFilter.SHARPEN)
        return sharpened

    @classmethod
    def extract_text_from_image_bytes(cls, image_bytes: bytes) -> str:
        try:
            image = Image.open(io.BytesIO(image_bytes))
            processed = cls.preprocess_image(image)
            text = pytesseract.image_to_string(processed)
            return text.strip()
        except pytesseract.TesseractNotFoundError:
            raise RuntimeError(
                "Tesseract OCR is not installed or not configured in the system PATH."
            )
        except Exception as e:
            raise RuntimeError(f"OCR processing failed: {str(e)}")
