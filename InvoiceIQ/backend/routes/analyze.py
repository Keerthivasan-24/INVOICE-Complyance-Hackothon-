import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from ml_pipeline.inference import process_document

router = APIRouter(prefix="/api")

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process document using ML pipeline
        result = process_document(file_path)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Optional: clean up file after processing
        # if os.path.exists(file_path):
        #     os.remove(file_path)
        pass
