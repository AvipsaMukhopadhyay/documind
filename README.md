# DocuMind — AI Document Summary Assistant

DocuMind is a production-ready web application that extracts text from native PDFs, scanned PDF documents, and images (PNG/JPG) using PyMuPDF and Tesseract OCR. It analyzes and summarizes the extracted contents via Gemini LLM, extracting key takeaways, main ideas, and tangible improvement suggestions.

---

## Document Processing Architecture

```
User Upload (PDF / Image)
          │
          ▼
┌──────────────────┐
│ File Validation  │ (Extension, MIME type, size limit checks)
└─────────┬────────┘
          │
          ├── Native PDF ────────► PyMuPDF Page Text Extraction
          │
          └── Scanned PDF / Img ─► Image Preprocessing ─► Tesseract OCR
                                                                │
                                                                ▼
                                                    ┌────────────────────────┐
                                                    │ Full Text Aggregation  │
                                                    └───────────┬────────────┘
                                                                │
                                                     (If text exceeds limit)
                                                                ▼
                                                    ┌────────────────────────┐
                                                    │ Text Chunking Engine   │
                                                    └───────────┬────────────┘
                                                                │
                                                                ▼
                                                    ┌────────────────────────┐
                                                    │ LLM (Gemini 2.5 Flash) │
                                                    └───────────┬────────────┘
                                                                │
                                                                ▼
                                                    ┌────────────────────────┐
                                                    │ Structured JSON Output │
                                                    └────────────────────────┘
```

---

## Prerequisites

1. **Python 3.10+**
2. **Node.js 18+ & npm**
3. **Tesseract OCR**:
   - **Ubuntu/Debian**: `sudo apt-get install -y tesseract-ocr`
   - **macOS**: `brew install tesseract`
   - **Windows**: Download installer from UB-Mannheim and set `TESSERACT_CMD` in `.env` if not in system PATH.

---

## Setup & Local Development

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env
```

Edit `backend/.env` and add your `GEMINI_API_KEY`.

Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at `http://localhost:8000`.

---

### 2. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```
Frontend will be running at `http://localhost:5173`.

---

## Production Deployment

### Frontend (Vercel / Netlify)
1. Build the production assets: `npm run build`
2. Set the environment variable: `VITE_API_BASE_URL=https://your-backend-domain.com/api`

### Backend (Render / Railway / Fly.io / Docker)
Deploy using the provided `backend/Dockerfile` which automatically bundles Tesseract OCR and system libraries. Ensure `GEMINI_API_KEY` is set in the cloud provider's environment variables.
