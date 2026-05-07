import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  initDb,
  insertFile,
  getAllFiles,
  getFileById,
  insertNotification,
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteFile,
  getTotalStats
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const UPLOAD_FOLDER = path.join(__dirname, 'uploads');

// Ensure uploads folder exists
fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  }
});


// ============ ROUTES ============

// Upload files
app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    const files = req.files || [];
    const uploadCount = files.length;

    if (uploadCount === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    // Store files in database
    for (const file of files) {
      await insertFile(file.originalname, file.size, file.path);
    }

    const bulkMode = uploadCount > 3;

    // If bulk mode, add notification and simulate background processing
    if (bulkMode) {
      await insertNotification(`Uploading ${uploadCount} files in background...`, 'info');

      // Simulate background processing after 2 seconds
      setTimeout(async () => {
        await insertNotification(`${uploadCount} files uploaded successfully`, 'success');
      }, 2000);
    }

    res.json({
      success: true,
      uploadCount,
      bulkMode
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all files
app.get('/api/files', async (req, res) => {
  try {
    const files = await getAllFiles();
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await getAllNotifications();
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
app.post('/api/notifications/read/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await markNotificationAsRead(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
app.post('/api/notifications/read-all', async (req, res) => {
  try {
    await markAllNotificationsAsRead();
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ error: error.message });
  }
});

// Download file
app.get('/api/download/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const file = await getFileById(id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(file.path, file.name);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete file
app.delete('/api/files/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const file = await getFileById(id);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    await deleteFile(id);
    await insertNotification(`Deleted: ${file.name}`, 'info');
    
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get analytics/stats
app.get('/api/analytics', async (req, res) => {
  try {
    const stats = await getTotalStats();
    console.log('📊 Backend stats:', stats);
    
    const response = {
      totalFiles: parseInt(stats.totalFiles) || 0,
      totalSize: parseInt(stats.totalSize) || 0,
      totalSizeMB: parseFloat(((parseInt(stats.totalSize) || 0) / (1024 * 1024)).toFixed(2)),
      uploadDays: parseInt(stats.uploadDays) || 0
    };
    
    console.log('📊 Response:', response);
    res.json(response);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      error: error.message,
      totalFiles: 0,
      totalSize: 0,
      totalSizeMB: 0,
      uploadDays: 0
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
  }
  if (err.message === 'Only PDF files allowed') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = 5000;
(async () => {
  await initDb();
  app.listen(PORT, () => {
    console.log(`✅ Express server running on http://localhost:${PORT}`);
  });
})();
