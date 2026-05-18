# InvoiceIQ - AI-Powered Invoice Processing

A production-ready full-stack application that leverages an AI/ML pipeline to detect, extract, and validate data from multi-invoice documents.

## Project Structure

```
project-root/
│
├── frontend/             # Next.js / Vite React frontend
│
├── backend/              # FastAPI application
│   ├── app.py            # Main entry point
│   ├── requirements.txt  # Backend dependencies
│   ├── routes/           # API routes (e.g. /analyze)
│   ├── services/         # Shared services
│   ├── uploads/          # Temporary storage for uploads
│   ├── outputs/          # Output/cached responses
│   │
│   └── ml_pipeline/      # Extracted ML Pipeline
│       ├── models/       # Model weights
│       ├── scripts/      # OCR & Segmentation scripts
│       ├── utils/        # Utilities
│       ├── inference.py  # Inference entry point
│       ├── config.py     # Configuration
│       └── requirements.txt
│
├── docker-compose.yml    # Deployment configuration
└── README.md
```

## Features

- **Document Processing**: Upload PDFs or Images containing multiple invoices.
- **ML Pipeline**: Uses OpenCV for preprocessing, YOLO/rule-based for layout segmentation, and Tesseract for OCR.
- **Validation**: Verifies tax totals and flags anomalies.
- **Unified Interface**: Clean React/Next.js frontend to view processed invoice data.

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- Tesseract OCR (`sudo apt-get install tesseract-ocr` or `brew install tesseract`)

### Running Locally (Docker)

```bash
docker-compose up --build
```
This will start the backend at `http://localhost:8000` and frontend at `http://localhost:5173`.

### Running Locally (Manual)

#### 1. Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment

- **Frontend (Vercel)**: Import the `frontend` folder directly into Vercel. Ensure the environment variable `VITE_API_URL` is set to your backend URL.
- **Backend (Render/Railway)**: Use the `backend` folder as the root directory for deployment. Set the build command to `pip install -r requirements.txt` and start command to `uvicorn app:app --host 0.0.0.0 --port $PORT`. Ensure Tesseract OCR is installed in the deployment environment (e.g. using a `Dockerfile`).