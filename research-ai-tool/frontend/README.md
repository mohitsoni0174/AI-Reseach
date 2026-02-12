# Earnings Call Analyzer - Frontend

A premium SaaS-style frontend for analyzing earnings call transcripts using AI.

## 🎨 Design Features

- **Premium Glassmorphism UI** - Modern translucent card designs
- **Dark Navy Gradient Background** - Professional color scheme
- **Smooth Animations** - 200ms transitions, loading states, success animations
- **Responsive Layout** - Works on all screen sizes
- **Inter Typography** - Clean, modern font from Google Fonts
- **Drag & Drop Upload** - Intuitive PDF upload interface
- **Progress Tracking** - Real-time upload progress bar
- **Toast Notifications** - Elegant error handling
- **Trust Indicators** - Security badges and AI processing indicators

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **Custom Animations** - Shimmer effects, glow, success states

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Navigation bar with branding
│   │   ├── UploadCard.jsx    # Main upload interface
│   │   └── Toast.jsx         # Error notification component
│   ├── services/
│   │   └── api.js            # Axios API service layer
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles + Tailwind
├── public/
│   └── vite.svg
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env                      # API endpoint configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Backend server running on port 8000

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## 🔌 Backend Integration

### API Configuration

The frontend connects to the backend via axios. Configure the API endpoint in `.env`:

```env
VITE_API_URL=http://localhost:8000
```

### API Service (`src/services/api.js`)

**Upload PDF:**
```javascript
import { uploadAndAnalyzePDF } from './services/api';

const result = await uploadAndAnalyzePDF(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

**Health Check:**
```javascript
import { checkServerHealth } from './services/api';

const status = await checkServerHealth();
console.log(status); // { status: "healthy", service: "...", version: "..." }
```

## 🎯 Key Features

### 1. Drag & Drop Upload
- Supports PDF files up to 50MB
- Visual feedback on drag events
- File type and size validation

### 2. Progress Tracking
- Real-time upload percentage
- Animated progress bar with shimmer effect
- Loading spinner during analysis

### 3. Success State
- Animated checkmark on completion
- Display analysis results
- Auto-reset after 8 seconds

### 4. Error Handling
- Toast notifications for errors
- Auto-dismiss after 5 seconds
- Manual close option

### 5. Trust Indicators
- Secure upload badge
- AI processing indicator
- File requirements display

## 🎨 Design System

### Colors
- **Navy Background**: `#0a0e27`, `#0f1633`, `#141d42`
- **Accent Cyan**: `#38bdf8`
- **Gradients**: Cyan to Blue (`from-cyan-500 to-blue-500`)

### Spacing
- Uses 8px base unit system
- Padding: `p-4`, `p-6`, `p-8`, `p-12`
- Gaps: `gap-2`, `gap-3`, `gap-4`, `gap-6`

### Border Radius
- Cards: `rounded-2xl` (16px), `rounded-3xl` (20px)
- Buttons: `rounded-2xl` (16px)
- Small elements: `rounded-xl` (12px)

### Animations
- **Shimmer**: Loading bar effect
- **Glow**: Pulsing shadow on hover
- **Success**: Scale + fade in
- **Transitions**: 200ms ease

## 📦 Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

Build output goes to `dist/` directory.

## 🔧 Configuration

### Vite Config (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

### Tailwind Config (`tailwind.config.js`)
Custom theme extensions:
- Navy color palette
- Custom animations (shimmer, glow, success)
- Inter font family

## 🧩 Component Architecture

### App.jsx
Main container managing error state and layout

### Header.jsx
- Logo and branding
- API connection status indicator

### UploadCard.jsx
- Drag & drop zone
- File upload handling
- Progress display
- Success/error states
- Analysis results preview

### Toast.jsx
- Error notifications
- Auto-dismiss timer
- Close button

### api.js
- Axios instance configuration
- Upload with progress tracking
- Error handling
- Type safety

## 🎭 State Management

Uses React hooks:
- `useState` - Component state
- `useCallback` - Memoized event handlers
- `useEffect` - Side effects (auto-dismiss)

## 🔐 Security

- File type validation (PDF only)
- File size limits (50MB max)
- Secure HTTPS uploads (production)
- CORS configured on backend

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Modern browsers with ES6+ support

## 📝 License

MIT

## 🤝 Contributing

1. Follow the existing code style
2. Use Tailwind CSS utility classes
3. Maintain 8px spacing system
4. Keep components small and focused
5. Add comments for complex logic

---

Built with ❤️ using React + Vite + Tailwind CSS
