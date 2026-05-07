import React from 'react';

export default function FileList({ files }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">📚 Uploaded Documents</h2>
      
      {files.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-100 border-b border-blue-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-blue-900">Filename</th>
                <th className="px-6 py-4 text-left font-semibold text-blue-900">Size</th>
                <th className="px-6 py-4 text-left font-semibold text-blue-900">Uploaded</th>
                <th className="px-6 py-4 text-left font-semibold text-blue-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {files.map(f => (
                <tr key={f.id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{f.name}</td>
                  <td className="px-6 py-4 text-gray-600">{(f.size / 1024).toFixed(2)} KB</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(f.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/api/download/${f.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      ⬇️ Download
                    </a>
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
