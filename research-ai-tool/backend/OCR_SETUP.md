# OCR Setup Instructions

The earnings call analyzer now supports **OCR fallback** for scanned/image-based PDFs.

## System Requirements

To use OCR functionality, you need to install two system dependencies:

### 1. Tesseract OCR (Required for OCR)

**Windows:**
1. Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Run the installer (tesseract-ocr-w64-setup-5.x.x.exe)
3. During installation, note the installation path (default: `C:\Program Files\Tesseract-OCR`)
4. Add Tesseract to your system PATH:
   - Open System Properties → Environment Variables
   - Edit PATH variable
   - Add: `C:\Program Files\Tesseract-OCR`
5. Verify installation:
   ```powershell
   tesseract --version
   ```

**Alternative (if PATH doesn't work):**
Set Tesseract path in your code:
```python
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

### 2. Poppler (Required for pdf2image)

**Windows:**
1. Download from: https://github.com/oschwartz10612/poppler-windows/releases/
2. Extract to a folder (e.g., `C:\poppler`)
3. Add `C:\poppler\Library\bin` to your system PATH
4. Verify installation:
   ```powershell
   pdftoppm -v
   ```

**Alternative without PATH:**
Specify poppler path when using pdf2image:
```python
from pdf2image import convert_from_path
images = convert_from_path('file.pdf', poppler_path=r'C:\poppler\Library\bin')
```

## How It Works

1. **First attempt**: Standard text extraction from PDF (fast, works for text-based PDFs)
2. **Fallback**: If no text is found, automatically tries OCR (slower, works for scanned PDFs)

## Testing OCR

Upload a scanned/image-based PDF to `/analyze` endpoint. The system will:
- Try text extraction
- If that fails, automatically use OCR
- Return the extracted text

## Troubleshooting

**Error: "tesseract is not installed"**
- Tesseract is not in PATH or not installed
- Follow installation steps above

**Error: "Unable to get page count. Is poppler installed?"**
- Poppler is not in PATH or not installed
- Follow installation steps above

**OCR is slow**
- Normal - OCR processing takes time (especially for large PDFs)
- 300 DPI is used for accuracy
- Consider reducing DPI in extractor.py if speed is critical

## Performance Notes

- **Text-based PDFs**: Fast (milliseconds)
- **Scanned PDFs with OCR**: Slow (seconds to minutes depending on pages)
- OCR uses 300 DPI for good accuracy
- Each page is processed sequentially
