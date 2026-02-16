import React, { useState, useEffect } from 'react';
import { FolderPlus } from 'lucide-react';
import { useLocalFolders } from '../../hooks/useLocalFolders';
import FolderCard from './FolderCard';
import { ask } from '@tauri-apps/plugin-dialog';

const Local: React.FC = () => {
  const { folders, getFolders, addFolder, deleteFolders } = useLocalFolders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderPath, setNewFolderPath] = useState('');

  useEffect(() => {
    getFolders();
  }, [getFolders]);

  const handleAddFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName || !newFolderPath) return;

    try {
      await addFolder(newFolderName, newFolderPath);
      setNewFolderName('');
      setNewFolderPath('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add folder:', error);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    const confirmed = await ask('Are you sure you want to delete this folder?', {
      title: 'Confirm Deletion',
      kind: 'warning',
    });

    if (confirmed) {
      try {
        await deleteFolders([id]);
      } catch (error) {
        console.error('Failed to delete folder:', error);
      }
    }
  };

  return (
    <div className="flex-1 bg-transparent text-gray-900 overflow-y-auto custom-scrollbar pb-[144px] lg:pb-24 p-4 md:p-6 lg:p-8">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-2 drop-shadow-sm">
              Local Files
            </h1>
            <p className="text-gray-600 font-medium tracking-wide text-sm md:text-base">
              Manage your local music directories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {folders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} onDelete={handleDeleteFolder} />
          ))}

          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-white/10 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 min-h-[160px] md:min-h-[180px]"
          >
            <div className="p-4 bg-gray-100 rounded-full group-hover:bg-indigo-50 text-gray-400 group-hover:text-indigo-500 transition-colors mb-4">
              <FolderPlus className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <span className="font-bold text-gray-500 group-hover:text-indigo-600 transition-colors text-sm md:text-base">
              Add New Folder
            </span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 border border-white/50 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">Add Local Folder</h2>
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
