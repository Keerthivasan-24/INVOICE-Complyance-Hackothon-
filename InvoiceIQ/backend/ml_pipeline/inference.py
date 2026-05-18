import os
import uuid
import time
from typing import Dict, Any

# Ensure models/cache directories exist
os.makedirs(os.path.join(os.path.dirname(__file__), "models"), exist_ok=True)

from ml_pipeline.scripts.pipeline import run as pipeline_run

def process_document(file_path: str) -> Dict[str, Any]:
    """
    Main inference entry point.
    Loads the document, runs OCR, segments invoices, extracts fields and line items,
    and returns a structured JSON response.
    """
    start_time = time.time()
    document_id = f"DOC{uuid.uuid4().hex[:8].upper()}"
    
    # Run the pipeline
    result = pipeline_run(file_path, document_id=document_id)
    
    # Format the response to match the TARGET ARCHITECTURE
    formatted_invoices = []
    
    for inv in result.invoices:
        formatted_inv = {
            "document_id": document_id,
            "invoice_number": inv.invoice_number,
            "seller_name": inv.seller_name,
            "buyer_name": inv.buyer_name,
            "subtotal": inv.subtotal,
            "tax_amount": inv.tax_amount,
            "total_amount": inv.total_amount,
            "validation_errors": inv.validation_errors,
            "validation_status": "valid" if (not inv.validation_errors and inv.confidence_score >= 0.6) else "review",
            "confidence_score": inv.confidence_score
        }
        formatted_invoices.append(formatted_inv)
        
    processing_time = round(time.time() - start_time, 2)
    
    return {
        "document_id": document_id,
        "invoice_count": result.invoice_count,
        "processing_time": processing_time,
        "invoices": formatted_invoices
    }
