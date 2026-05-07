import { useState } from 'react';

export default function FileList({ files, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null);

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/files/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefresh();
      } else {
        alert('Failed to delete file');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting file');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">📚 Uploaded Documents</h2>
        <input
          type="text"
          placeholder="🔍 Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition w-64"
        />
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No documents uploaded yet</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No files match your search</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-100 border-b border-blue-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-blue-900">Filename</th>
                <th className="px-6 py-4 text-left font-semibold text-blue-900">Size</th>
                <th className="px-6 py-4 text-left font-semibold text-blue-900">Uploaded</th>
                <th className="px-6 py-4 text-left font-semibold text-blue-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFiles.map(f => (
                <tr key={f.id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{f.name}</td>
                  <td className="px-6 py-4 text-gray-600">{(f.size / 1024).toFixed(2)} KB</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(f.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <a
                      href={`/api/download/${f.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      ⬇️ Download
                    </a>
                    <button
                      onClick={() => handleDelete(f.id, f.name)}
                      disabled={deleting === f.id}
                      className="text-red-600 hover:text-red-800 font-medium transition disabled:opacity-50"
                    >
                      {deleting === f.id ? '⏳' : '🗑️'} Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
