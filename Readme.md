# Document Management Dashboard

Full-stack application for uploading PDF documents, tracking progress in real-time, and receiving bulk upload notifications.

## Features

✅ **File Upload** — Drag-and-drop or select single/multiple PDFs  
✅ **Individual Progress** — Real-time progress bar for each file  
✅ **Smart Notifications** — Background processing for 3+ files with real-time updates  
✅ **Notification Center** — Persistent notifications with read/unread status  
✅ **Download** — Download uploaded documents  

## Quick Start

### Frontend Only (Completed)

```bash
set PATH=C:\Program Files\nodejs;%PATH%
npm install
npm run dev
```

Frontend runs on `http://localhost:3000/`

### Full Stack (Backend Next)

Backend API will be built with Node.js/Express or Python/Flask.

## How It Works

1. **Upload Files** — Drag PDFs into the upload zone or click to select
2. **Track Progress** — Each file shows individual upload progress
3. **Bulk Mode** — Upload 4+ files? See background processing notification
4. **Real-time Updates** — Notifications when processing completes
5. **Notification Center** — Click bell icon to view all notifications with timestamps
6. **Download** — Access uploaded files from the document list

## Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS (✅ Complete)
- **Backend**: Node.js/Express (Next)
- **Storage**: Local disk
- **Design**: Livvic font, white/blue theme

## Frontend Structure

```
src/
├── App.jsx                    # Main app with header & state
├── components/
│   ├── Upload.jsx            # Drag-drop, file selection, progress
│   ├── FileList.jsx          # Document table
│   └── NotificationCenter.jsx # Notification modal
├── index.css                 # Tailwind styles
└── main.jsx                  # React entry point
```

### Frontend Features Implemented

- **Upload Component** 
  - Drag-and-drop zone with visual feedback
  - File selection via button
  - Individual file progress bars
  - Bulk mode detection (3+ files)
  - Clear button to reset

- **File List**
  - Display uploaded files in table
  - Show filename, size, upload date
  - Download links for each file

- **Notification Center**
  - Modal popup with all notifications
  - Unread badge on notification bell
  - Mark individual/all as read
  - Timestamp display

- **Styling**
  - Livvic font throughout
  - Blue/white color scheme
  - Gradient background
  - Responsive design
  - Hover effects on all interactive elements

## Status

**✅ FRONTEND COMPLETE** — Ready for backend integration

- React + Vite dev server running on port 3000
- All UI components built and styled
- Proxy configured for backend API calls (/api → http://localhost:5000)
- Error handling and loading states in place

**Next Steps**: Build backend API endpoints

---

Built for SWS AI Technical Assessment