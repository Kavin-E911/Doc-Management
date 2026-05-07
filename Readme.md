# Document Management Dashboard

Full-stack application for uploading PDF documents, tracking progress in real-time, and receiving bulk upload notifications.

**Status:** ✅ **Full Stack Complete & Running**

---

## Tech Stack

### Frontend (Port 3000)
- **React 18** — Component-based UI
- **Vite 4.5** — Lightning-fast dev server with HMR
- **Tailwind CSS 3** — Utility-first styling framework
- **Axios** — HTTP client for API requests

### Backend (Port 5000)
- **Node.js v24+** — JavaScript runtime
- **Express.js 4.18** — Minimal web framework
- **SQLite3** — File-based relational database
- **Multer 1.4** — Multipart form data handler (file uploads)
- **CORS 2.8** — Cross-origin resource sharing

---

## Quick Start

### Terminal 1: Frontend
```bash
set PATH=C:\Program Files\nodejs;%PATH%
cd c:\Users\Student\Desktop\Document Management
npm run dev
```
Runs on **http://localhost:3000/**

### Terminal 2: Backend
```bash
set PATH=C:\Program Files\nodejs;%PATH%
cd c:\Users\Student\Desktop\Document Management\server
node server.js
```
Runs on **http://localhost:5000/**

---

## Features

✅ **File Upload** — Drag-and-drop + multi-select, stored on disk  
✅ **Progress Tracking** — Real-time progress bars for each file  
✅ **Smart Notifications** — Bulk mode for 3+ files with background processing  
✅ **Notification Center** — Persistent SQLite storage, read/unread status  
✅ **Download** — Retrieve uploaded PDFs from the dashboard  

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload multiple PDFs |
| GET | `/api/files` | List all files |
| GET | `/api/notifications` | Get all notifications |
| POST | `/api/notifications/read/:id` | Mark as read |
| POST | `/api/notifications/read-all` | Mark all as read |
| GET | `/api/download/:id` | Download file |
| GET | `/api/health` | Health check |

---

## Database Schema

**files** table — Stores file metadata
```sql
CREATE TABLE files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  path TEXT NOT NULL,
  uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**notifications** table — Stores all notifications
```sql
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  isRead INTEGER DEFAULT 0
)
```

---

## Project Structure

```
├── Frontend (Root)
│   ├── package.json              # React + Vite dependencies
│   ├── vite.config.js            # Dev server (port 3000, /api proxy)
│   ├── tailwind.config.js        # Tailwind theme
│   ├── index.html                # Entry HTML
│   └── src/
│       ├── App.jsx               # Main component + state
│       ├── main.jsx              # React root
│       ├── index.css             # Global styles
│       └── components/
│           ├── Upload.jsx        # File upload form
│           ├── FileList.jsx      # Documents table
│           └── NotificationCenter.jsx  # Notification modal
│
└── Backend (server/)
    ├── package.json              # Express + Multer + SQLite3
    ├── server.js                 # Express app + routes
    ├── db.js                     # SQLite helper functions
    ├── uploads/                  # Uploaded PDF files
    └── documents.db              # SQLite database file
```

---

## Git Commits

```
6f64248 Update README: Frontend complete and running on port 3000
e96ffc0 Complete React frontend with Vite + Tailwind + all components
603d11a Build Flask app with vanilla JS frontend - no build step needed
40110ef Backend complete: Express API with SQLite database on port 5000
```

---

## How It Works

1. User drags/selects PDFs → Upload component queues files
2. Click Upload → FormData sent to `/api/upload` (Vite proxy)
3. Multer validates & saves PDFs to disk
4. Express handler inserts metadata into SQLite
5. If 3+ files → Creates background processing notification
6. Frontend polls `/api/notifications` every 2 seconds
7. User clicks bell → NotificationCenter modal opens
8. Notifications show timestamp, type, unread status
9. Click notification → Marks as read (updates SQLite)
10. Download links retrieve files from disk

---

Built for SWS AI Technical Assessment
