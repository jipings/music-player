import React, { useState } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { mockFolders, LocalFolder } from '../../mockData';
import FolderCard from './FolderCard';

const Local: React.FC = () => {
  const [folders, setFolders] = useState<LocalFolder[]>(mockFolders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderPath, setNewFolderPath] = useState('');

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName || !newFolderPath) return;

    const newFolder: LocalFolder = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFolderName,
      path: newFolderPath,
      songCount: 0,
    };

    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setNewFolderPath('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 bg-transparent text-gray-900 overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2 drop-shadow-sm">
              Local Files
            </h1>
            <p className="text-white/80 font-medium tracking-wide">
              Manage your local music directories
            </p>
          </div>
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))}

          {/* Add Folder Card (Empty State / Shortcut) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-white/10 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 min-h-[180px]"
          >
            <div className="p-4 bg-gray-100 rounded-full group-hover:bg-indigo-50 text-gray-400 group-hover:text-indigo-500 transition-colors mb-4">
              <FolderPlus className="w-8 h-8" />
            </div>
            <span className="font-bold text-gray-500 group-hover:text-indigo-600 transition-colors">
              Add New Folder
            </span>
          </button>
        </div>
      </div>

      {/* Add Folder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/50 scale-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Add Local Folder</h2>
            <form onSubmit={handleAddFolder} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Folder Name</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  placeholder="e.g. My Music"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Path</label>
                <input
                  type="text"
                  value={newFolderPath}
                  onChange={(e) => setNewFolderPath(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono text-sm"
                  placeholder="/path/to/music"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
                >
                  Scan Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Local;
