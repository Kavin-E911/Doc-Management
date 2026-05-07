export default function Analytics({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
        <div className="text-sm font-semibold opacity-90">📄 Total Files</div>
        <div className="text-3xl font-bold mt-2">{stats.totalFiles || 0}</div>
        <div className="text-xs opacity-75 mt-2">Documents uploaded</div>
      </div>
      
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
        <div className="text-sm font-semibold opacity-90">💾 Storage Used</div>
        <div className="text-3xl font-bold mt-2">{stats.totalSizeMB || '0'} MB</div>
        <div className="text-xs opacity-75 mt-2">{stats.totalSize || 0} bytes</div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
        <div className="text-sm font-semibold opacity-90">📅 Upload Days</div>
        <div className="text-3xl font-bold mt-2">{stats.uploadDays || 0}</div>
        <div className="text-xs opacity-75 mt-2">Active days</div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
        <div className="text-sm font-semibold opacity-90">⚡ Status</div>
        <div className="text-3xl font-bold mt-2">{stats.totalFiles > 0 ? '✓' : '○'}</div>
        <div className="text-xs opacity-75 mt-2">{stats.totalFiles > 0 ? 'Active' : 'Empty'}</div>
      </div>
    </div>
  );
}
