import { useEffect, useState } from 'react';
import FileList from './components/FileList';
import NotificationCenter from './components/NotificationCenter';
import Upload from './components/Upload';
import './index.css';

export default function App() {
  const [files, setFiles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch files on mount
  useEffect(() => {
    fetchFiles();
    fetchNotifications();
    
    // Poll for notifications every 2 seconds
    const notifInterval = setInterval(fetchNotifications, 2000);
    
    return () => clearInterval(notifInterval);
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const notifs = await res.json();
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleUploadComplete = () => {
    fetchFiles();
    fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-900">📄 Document Management</h1>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-blue-50 rounded-lg transition"
          >
            <span className="text-2xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {showNotifications && (
          <NotificationCenter
            notifications={notifications}
            onRefresh={fetchNotifications}
            onClose={() => setShowNotifications(false)}
          />
        )}

        <Upload onUploadComplete={handleUploadComplete} />
        <FileList files={files} />
      </div>
    </div>
  );
}
