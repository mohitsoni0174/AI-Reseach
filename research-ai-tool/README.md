# 🎯 Earnings Call Analyzer

AI-powered earnings call transcript analysis platform built with React, FastAPI, and OpenAI GPT-4.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

## ✨ Features

- 📄 **PDF Upload** - Drag & drop earnings call transcripts
- 🤖 **AI Analysis** - Powered by OpenAI GPT-4
- 📊 **Key Insights** - Automatic extraction of metrics and sentiment
- 🎨 **Premium UI** - Modern glassmorphism design
- ⚡ **Real-time Progress** - Live upload tracking
- 🔒 **Secure** - Enterprise-grade file handling
- 📱 **Responsive** - Works on all devices

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance Python API framework
- **OpenAI API** - GPT-4 for transcript analysis
- **PyPDF** - PDF text extraction
- **Tesseract OCR** - Scanned document support
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Inter Font** - Clean typography

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- OpenAI API Key
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/research-ai-tool.git
cd research-ai-tool
```

2. **Backend Setup**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start server
python main.py
```

Backend runs at: http://localhost:8000

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# VITE_API_URL should be http://localhost:8000

# Start development server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 📦 Project Structure

```
research-ai-tool/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── analyzer.py          # OpenAI integration
│   ├── extractor.py         # PDF text extraction
│   ├── prompt.py            # AI prompts
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Container config
│   └── .env.example         # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API layer
│   │   ├── App.jsx          # Main component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   └── .env.example         # Environment template
├── render.yaml              # Render deployment config
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # This file
```

---

## 🌐 Deployment

### Deploy to Render (Free)

**One-Click Deploy:**

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" → "Blueprint"
4. Connect your repository
5. Set environment variables:
   - `OPENAI_API_KEY` (backend)
6. Click "Apply"

**Manual Deploy:**

See detailed instructions in [DEPLOYMENT.md](DEPLOYMENT.md)

### Deploy to Other Platforms

- **Vercel** - Frontend only
- **Railway** - Full-stack
- **AWS/DigitalOcean** - Self-hosted

---

## 🔒 Environment Variables

### Backend (.env)

```env
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=*  # or specific domain
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000  # or production URL
```

---

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints

**GET /** - Health check
```json
{
  "status": "healthy",
  "service": "Earnings Call Analyzer",
  "version": "1.0.0"
}
```

**POST /analyze** - Analyze PDF
- Request: `multipart/form-data` with PDF file
- Response: Analysis results in JSON

---

## 🎨 UI Preview

- **Glassmorphism Design** - Translucent cards with backdrop blur
- **Dark Navy Theme** - Professional color scheme
- **Smooth Animations** - 200ms transitions, shimmer effects
- **Progress Tracking** - Real-time upload percentage
- **Toast Notifications** - Elegant error handling

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📊 Performance

- **PDF Processing**: ~5-15 seconds for average transcript
- **OCR Fallback**: ~30-60 seconds for scanned documents
- **API Response**: Sub-second for health checks
- **Build Size**: ~200KB gzipped (frontend)

---

## 🔧 Configuration

### Backend Config

Edit `backend/main.py`:
- `MAX_FILE_SIZE` - Maximum PDF size (default: 50MB)
- `ALLOWED_CONTENT_TYPES` - Supported file types

### Frontend Config

Edit `frontend/vite.config.js`:
- Port number
- Proxy settings
- Build optimizations

---

## 🐛 Troubleshooting

### Backend Issues

**"OPENAI_API_KEY not set"**
```bash
# Check .env file exists in backend/
# Verify key is valid at https://platform.openai.com/api-keys
```

**"Tesseract not found"**
```bash
# Install Tesseract OCR
# See backend/OCR_SETUP.md for instructions
```

### Frontend Issues

**"Network Error"**
```bash
# Check backend is running
# Verify VITE_API_URL in frontend/.env
# Check CORS settings in backend
```

**Build fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- FastAPI for excellent documentation
- Render for free hosting
- Tailwind CSS for design system

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/research-ai-tool/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/research-ai-tool/discussions)
- **Email**: your-email@example.com

---

## 🗺️ Roadmap

- [ ] User authentication
- [ ] Analysis history
- [ ] Export to PDF/Excel
- [ ] Batch processing
- [ ] Custom AI prompts
- [ ] Comparison between transcripts
- [ ] Real-time collaboration
- [ ] Mobile app

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Built with ❤️ using React, FastAPI, and OpenAI**

[Live Demo](https://earnings-analyzer-frontend.onrender.com) | [Documentation](https://github.com/YOUR_USERNAME/research-ai-tool/wiki) | [API Docs](https://earnings-analyzer-api.onrender.com/docs)
