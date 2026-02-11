"""PDF text extraction module with OCR fallback."""

import pypdf
import pytesseract
from pdf2image import convert_from_path
from typing import Optional
import os

# Configure Tesseract executable path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def extract_text_with_ocr(file_path: str) -> str:
    """
    Extract text from PDF using OCR (for scanned/image-based PDFs).
    
    Requires Tesseract OCR and Poppler to be installed on the system.
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        Extracted text as a single string
        
    Raises:
        ValueError: If OCR dependencies are missing or extraction fails
    """
    try:
        # Convert PDF to images (requires Poppler)
        images = convert_from_path(file_path, dpi=300)
        
        # Extract text from each image using OCR (requires Tesseract)
        text_parts = []
        for i, image in enumerate(images):
            # Perform OCR on the image
            text = pytesseract.image_to_string(image, lang='eng')
            if text.strip():
                text_parts.append(text)
        
        full_text = "\n".join(text_parts)
        
        if not full_text.strip():
            raise ValueError("OCR could not extract any text from the PDF images")
        
        return full_text
        
    except pytesseract.TesseractNotFoundError:
        raise ValueError(
            "Tesseract OCR is not installed or not in PATH. "
            "Install from: https://github.com/UB-Mannheim/tesseract/wiki "
            "See OCR_SETUP.md for detailed instructions."
        )
    except Exception as e:
        error_msg = str(e)
        if "poppler" in error_msg.lower() or "pdftoppm" in error_msg.lower():
            raise ValueError(
                "Poppler is not installed or not in PATH. "
                "Download from: https://github.com/oschwartz10612/poppler-windows/releases/ "
                "See OCR_SETUP.md for detailed instructions."
            )
        raise ValueError(f"OCR extraction failed: {error_msg}")


def extract_text(file_path: str) -> str:
    """
    Extract all text from a PDF file safely with OCR fallback.
    
    First attempts standard text extraction. If that fails or returns
    no text (common with scanned PDFs), falls back to OCR.
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        Extracted text as a single string
        
    Raises:
        FileNotFoundError: If PDF file doesn't exist
        ValueError: If PDF is empty, corrupted, or text cannot be extracted
        pypdf.errors.PdfReadError: If PDF cannot be read
    """
    try:
        with open(file_path, 'rb') as file:
            reader = pypdf.PdfReader(file)
            
            # Check if PDF is encrypted
            if reader.is_encrypted:
                try:
                    reader.decrypt('')
                except:
                    raise ValueError("PDF is encrypted and cannot be read. Please provide an unencrypted PDF.")
            
            # Check if PDF has pages
            if len(reader.pages) == 0:
                raise ValueError("PDF file is empty (no pages found)")
            
            # Extract text from all pages with multiple methods
            text_parts = []
            for page_num, page in enumerate(reader.pages):
                # Try standard extraction
                page_text = page.extract_text()
                
                # Try alternative extraction with different settings
                if not page_text or not page_text.strip():
                    try:
                        page_text = page.extract_text(extraction_mode="layout")
                    except:
                        pass
                
                if page_text and page_text.strip():
                    text_parts.append(page_text)
            
            # Combine all text
            full_text = "\n".join(text_parts)
            
            # Validate extracted text
            if not full_text.strip():
                # No text found - likely a scanned PDF, try OCR
                print(f"No text layer found in PDF ({len(reader.pages)} pages). Attempting OCR...")
                try:
                    return extract_text_with_ocr(file_path)
                except Exception as ocr_error:
                    raise ValueError(
                        f"No text could be extracted from PDF ({len(reader.pages)} pages). "
                        "Standard extraction failed (likely scanned images). "
                        f"OCR fallback also failed: {str(ocr_error)}. "
                        "Please ensure Tesseract OCR is installed or use a PDF with selectable text."
                    )
            
            return full_text
            
    except FileNotFoundError:
        raise FileNotFoundError(f"PDF file not found: {file_path}")
    except pypdf.errors.PdfReadError as e:
        raise ValueError(f"Invalid or corrupted PDF file: {str(e)}")
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Error extracting text from PDF: {str(e)}")
