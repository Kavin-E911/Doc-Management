import React, { useState } from 'react';

export default function Upload({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [bulkMode, setBulkMode] = useState(false);

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(f => ({
      id: Math.random(),
      file: f,
      progress: 0,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setBulkMode(files.length > 3);

    const formData = new FormData();
    files.forEach(f => formData.append('files', f.file));

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setOverallProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploading(false);
          setFiles([]);
          setOverallProgress(0);
          setBulkMode(false);
          onUploadComplete();
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        alert('Upload failed');
      };

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover');
  };

  return (
    <div className="mb-12">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragDrop}
        className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer dragover:border-blue-600 dragover:bg-blue-100"
      >
        <p className="text-4xl mb-4">📤</p>
        <p className="text-lg font-semibold text-blue-900 mb-2">Drag & drop your PDFs here</p>
        <p className="text-sm text-blue-700 mb-4">or</p>
        <label className="inline-block">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer inline-block">
            Select Files
          </span>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8">
          {bulkMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-semibold">📦 Processing {files.length} files in background...</p>
            </div>
          )}

          <div className="space-y-3 mb-4">
            {files.map((f, idx) => (
              <div key={f.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{f.file.name}</p>
                    <p className="text-sm text-gray-500">{(f.file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold">
                    {uploading ? 'Uploading' : 'Pending'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploading ? overallProgress : 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">{Math.round(uploading ? overallProgress : 0)}%</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {uploading ? '⏳ Uploading...' : '📤 Upload'}
            </button>
            <button
              onClick={() => setFiles([])}
              disabled={uploading}
              className="px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
