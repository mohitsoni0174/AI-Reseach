# 🚀 Quick Start Guide

## Current Status

✅ **Backend Server**: Running on http://localhost:8000  
✅ **Frontend Server**: Running on http://localhost:5173  
✅ **Both servers connected and working!**

---

## Start Development Servers

### Terminal 1 - Backend
```powershell
cd C:\Users\MOHIT\Desktop\as\research-ai-tool\backend
C:/Users/MOHIT/Desktop/as/research-ai-tool/.venv/Scripts/python.exe main.py
```

### Terminal 2 - Frontend
```powershell
cd C:\Users\MOHIT\Desktop\as\research-ai-tool\frontend
npm run dev
```

---

## URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## How to Use

1. **Open Frontend**: Navigate to http://localhost:5173
2. **Upload PDF**: 
   - Drag & drop a PDF file onto the upload zone
   - OR click "Choose PDF File" to browse
3. **Watch Progress**: See real-time upload percentage
4. **View Results**: Analysis appears when complete
5. **Handle Errors**: Toast notifications for any issues

---

## Build for Production

### Frontend
```bash
cd frontend
npm run build
npm run preview  # Test production build
```

### Backend (Docker)
```bash
cd backend
docker build -t earnings-analyzer .
docker run -p 8000:8000 earnings-analyzer
```

---

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000
```

### Backend (`.env`)
```env
OPENAI_API_KEY=your_api_key_here
```

---

## File Structure

```
research-ai-tool/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── analyzer.py          # OpenAI analysis
│   ├── extractor.py         # PDF extraction
│   ├── prompt.py            # System prompts
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # API keys
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API layer (axios)
    │   ├── App.jsx          # Main component
    │   └── main.jsx         # Entry point
    ├── package.json         # Dependencies
    └── .env                 # API URL
```

---

## Key Technologies

- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **Backend**: FastAPI, OpenAI, PyPDF, Tesseract OCR
- **Styling**: Glassmorphism, dark navy gradients, Inter font
- **Animations**: Shimmer, glow, success states

---

## Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend errors
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### API connection fails
Check that:
- Backend is running on port 8000
- Frontend `.env` has correct `VITE_API_URL`
- No firewall blocking ports

---

## Documentation

- **Frontend README**: `frontend/README.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **OCR Setup**: `backend/OCR_SETUP.md`

---

**Ready to go! 🎉**
