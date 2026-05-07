import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'documents.db');

// Open database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Database error:', err);
});

export function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create files table
      db.run(`
        CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          size INTEGER NOT NULL,
          path TEXT NOT NULL,
          uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create notifications table
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          message TEXT NOT NULL,
          type TEXT DEFAULT 'info',
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          isRead INTEGER DEFAULT 0
        )
      `, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Database initialized');
          resolve();
        }
      });
    });
  });
}

export function insertFile(name, size, filePath) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO files (name, size, path)
      VALUES (?, ?, ?)
    `);
    stmt.run(name, size, filePath, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

export function getAllFiles() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT id, name, size, uploadedAt FROM files ORDER BY uploadedAt DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function getFileById(id) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT id, name, size, path FROM files WHERE id = ?
    `, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function insertNotification(message, type = 'info') {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO notifications (message, type)
      VALUES (?, ?)
    `);
    stmt.run(message, type, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

export function getAllNotifications() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT id, message, type, timestamp, isRead FROM notifications ORDER BY timestamp DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function markNotificationAsRead(id) {
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE notifications SET isRead = 1 WHERE id = ?
    `, [id], function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

export function markAllNotificationsAsRead() {
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE notifications SET isRead = 1
    `, function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

export function deleteFile(id) {
  return new Promise((resolve, reject) => {
    db.run(`
      DELETE FROM files WHERE id = ?
    `, [id], function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

export function getTotalStats() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        COUNT(*) as totalFiles, 
        SUM(size) as totalSize,
        COUNT(DISTINCT DATE(uploadedAt)) as uploadDays
      FROM files
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0] || { totalFiles: 0, totalSize: 0, uploadDays: 0 });
    });
  });
}
