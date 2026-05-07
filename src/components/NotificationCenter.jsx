
export default function NotificationCenter({ notifications, onRefresh, onClose }) {
  const markAsRead = async (id) => {
    await fetch(`/api/notifications/read/${id}`, { method: 'POST' });
    onRefresh();
  };

  const markAllAsRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'POST' });
    onRefresh();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-900">🔔 Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-4 cursor-pointer transition ${
                    n.isRead ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm flex-1 ${n.isRead ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                      {n.message}
                    </p>
                    {!n.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(n.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="p-4 border-t border-gray-200 bg-blue-50">
            <button
              onClick={markAllAsRead}
              className="w-full text-blue-600 hover:text-blue-800 font-semibold text-sm"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
