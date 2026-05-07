export default function Analytics({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
        <div className="text-sm font-semibold opacity-90">📄 Total Files</div>
        <div className="text-3xl font-bold mt-2">{stats.totalFiles}</div>
      </div>
      
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
        <div className="text-sm font-semibold opacity-90">💾 Storage Used</div>
        <div className="text-3xl font-bold mt-2">{stats.totalSizeMB} MB</div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="text-sm font-semibold opacity-90">📅 Upload Days</div>
        <div className="text-3xl font-bold mt-2">{stats.uploadDays}</div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
        <div className="text-sm font-semibold opacity-90">⚡ Active</div>
        <div className="text-3xl font-bold mt-2">{stats.totalFiles > 0 ? '✓' : '○'}</div>
      </div>
    </div>
  );
}
