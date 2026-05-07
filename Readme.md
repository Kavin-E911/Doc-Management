# Document Management Dashboard

Full-stack application for uploading PDF documents, tracking progress in real-time, and receiving bulk upload notifications.

## Features

✅ **File Upload** — Drag-and-drop or select single/multiple PDFs  
✅ **Individual Progress** — Real-time progress bar for each file  
✅ **Smart Notifications** — Background processing for 3+ files with real-time updates  
✅ **Notification Center** — Persistent notifications with read/unread status  
✅ **Download** — Download uploaded documents  

## Quick Start

### Install & Run

```bash
pip install -r requirements.txt
python app.py
```

Open `http://localhost:5000` in your browser.

## How It Works

1. **Upload Files** — Drag PDFs into the upload zone or click to select
2. **Track Progress** — Each file shows individual upload progress
3. **Bulk Mode** — Upload 4+ files? See background processing notification
4. **Real-time Updates** — Notifications when processing completes
5. **Notification Center** — Click bell icon to view all notifications with timestamps
6. **Download** — Access uploaded files from the document list

## Architecture

- **Frontend**: Vanilla HTML/CSS/JavaScript (no build step)
- **Backend**: Flask + SQLite
- **Storage**: Local disk (`app/uploads/`)
- **Design**: Livvic font, white/blue theme

## Database Schema

### files table
```sql
CREATE TABLE files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  path TEXT NOT NULL,
  uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### notifications table
```sql
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  isRead INTEGER DEFAULT 0
)
```

## API Endpoints

- `POST /api/upload` — Upload files
- `GET /api/files` — List all uploaded files
- `GET /api/notifications` — Get all notifications
- `POST /api/notifications/read/:id` — Mark notification as read
- `POST /api/notifications/read-all` — Mark all as read
- `GET /api/download/:id` — Download file

---

Built for SWS AI Technical Assessment — 1 hour challenge.