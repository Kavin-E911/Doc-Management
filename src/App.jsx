import { useEffect, useState } from 'react';
import FileList from './components/FileList';
import NotificationCenter from './components/NotificationCenter';
import Upload from './components/Upload';
import Analytics from './components/Analytics';
import './index.css';

export default function App() {
  const [files, setFiles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({ totalFiles: 0, totalSize: 0, totalSizeMB: 0, uploadDays: 0 });
  const [darkMode, setDarkMode] = useState(false);

  // Fetch files on mount
  useEffect(() => {
    fetchFiles();
    fetchNotifications();
    fetchAnalytics();
    
    // Poll for notifications every 2 seconds
    const notifInterval = setInterval(fetchNotifications, 2000);
    const analyticsInterval = setInterval(fetchAnalytics, 10000);
    
    return () => {
      clearInterval(notifInterval);
      clearInterval(analyticsInterval);
    };
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

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleUploadComplete = () => {
    fetchFiles();
    fetchNotifications();
    fetchAnalytics();
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'} shadow-sm border-b sticky top-0 z-40`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-blue-900'}`}>📄 Document Management</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-blue-50 text-gray-700 hover:bg-blue-100'}`}
                title="Toggle dark mode"
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'}`}
              >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {showNotifications && (
            <NotificationCenter
              notifications={notifications}
              onRefresh={fetchNotifications}
              onClose={() => setShowNotifications(false)}
            />
          )}

          {/* Analytics Dashboard */}
          <Analytics stats={stats} />

          <Upload onUploadComplete={handleUploadComplete} />
          <FileList files={files} onRefresh={fetchFiles} />
        </div>
      </div>
    </div>
  );
}
