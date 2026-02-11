# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for Tesseract OCR and Poppler
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Render will set the PORT environment variable)
EXPOSE 8000

# Run the FastAPI app with uvicorn
# Render provides PORT env variable, defaulting to 8000 if not set
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
