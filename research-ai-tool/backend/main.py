"""FastAPI backend for earnings call transcript analysis."""

import os
import json
import tempfile
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from extractor import extract_text
from analyzer import analyze_transcript


app = FastAPI(
    title="Earnings Call Analyzer API",
    description="Analyze earnings call transcripts using AI",
    version="1.0.0"
)

# CORS middleware - Configure for production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
ALLOWED_CONTENT_TYPES = ["application/pdf"]


@app.on_event("startup")
async def startup_event():
    """Log server startup for debugging."""
    print("\n" + "="*60)
    print("🚀 Server Starting")
    print("="*60)
    print(f"API Service: Earnings Call Analyzer v1.0.0")
    print(f"CORS Origins: {ALLOWED_ORIGINS}")
    print(f"Max File Size: {MAX_FILE_SIZE // (1024 * 1024)} MB")
    print("Endpoints: GET / (health), POST /analyze (PDF upload)")
    print("="*60 + "\n")


@app.get("/")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Earnings Call Analyzer",
        "version": "1.0.0"
    }


@app.post("/analyze")
async def analyze_earnings_call(file: UploadFile = File(...)):
    """
    Analyze an earnings call transcript PDF.
    
    Args:
        file: PDF file upload
        
    Returns:
        JSON response with structured analysis
        
    Raises:
        HTTPException: For various error conditions
    """
    temp_file_path = None
    
    try:
        # Validate file type
        if file.content_type not in ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Only PDF files are supported. Received: {file.content_type}"
            )
        
        # Read file content
        file_content = await file.read()
        
        # Validate file size
        if len(file_content) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )
        
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds maximum allowed size of {MAX_FILE_SIZE // (1024 * 1024)} MB"
            )
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name
        
        # Extract text from PDF
        try:
            transcript_text = extract_text(temp_file_path)
        except FileNotFoundError:
            raise HTTPException(
                status_code=500,
                detail="Internal error: Temporary file not found"
            )
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=f"PDF extraction error: {str(e)}"
            )
        
        # Analyze transcript
        try:
            analysis_json = analyze_transcript(transcript_text)
            analysis = json.loads(analysis_json)
        except ValueError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Analysis error: {str(e)}"
            )
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Invalid analysis format: {str(e)}"
            )
        
        # Return successful response
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "filename": file.filename,
                "analysis": analysis
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception:
                pass  # Ignore cleanup errors


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
