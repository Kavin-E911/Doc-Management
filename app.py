from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import os
import json
from datetime import datetime
from threading import Thread
import time

app = Flask(__name__, static_folder='static', template_folder='.')
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'app', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
DB_PATH = os.path.join(os.path.dirname(__file__), 'app', 'app.db')

# Initialize database
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        size INTEGER NOT NULL,
        path TEXT NOT NULL,
        uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        isRead INTEGER DEFAULT 0
    )''')
    conn.commit()
    conn.close()

init_db()

sse_clients = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist('files')
    if not files:
        return jsonify({'success': False, 'error': 'No files'}), 400
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    for file in files:
        if file and file.filename.endswith('.pdf'):
            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)
            size = os.path.getsize(filepath)
            c.execute('INSERT INTO files (name, size, path) VALUES (?, ?, ?)',
                     (file.filename, size, filepath))
    
    conn.commit()
    upload_count = len(files)
    bulk_mode = upload_count > 3
    
    if bulk_mode:
        c.execute('INSERT INTO notifications (message, type) VALUES (?, ?)',
                 (f'Uploading {upload_count} files in background...', 'info'))
        conn.commit()
        
        # Simulate background processing
        def process_in_background():
            time.sleep(2)
            c2 = sqlite3.connect(DB_PATH)
            c2.execute('INSERT INTO notifications (message, type) VALUES (?, ?)',
                      (f'{upload_count} files uploaded successfully', 'success'))
            c2.commit()
            c2.close()
        
        Thread(target=process_in_background, daemon=True).start()
    
    conn.close()
    return jsonify({'success': True, 'uploadCount': upload_count, 'bulkMode': bulk_mode})

@app.route('/api/files')
def get_files():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM files ORDER BY uploadedAt DESC')
    files = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(files)

@app.route('/api/notifications')
def get_notifications():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM notifications ORDER BY timestamp DESC')
    notifs = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(notifs)

@app.route('/api/notifications/read/<int:notif_id>', methods=['POST'])
def mark_read(notif_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE notifications SET isRead = 1 WHERE id = ?', (notif_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/notifications/read-all', methods=['POST'])
def mark_all_read():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE notifications SET isRead = 1')
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/download/<int:file_id>')
def download_file(file_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM files WHERE id = ?', (file_id,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        return jsonify({'error': 'File not found'}), 404
    
    return send_file(row[3], as_attachment=True, download_name=row[1])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
