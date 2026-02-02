import React from 'react';
import { Folder, Music2, Trash2 } from 'lucide-react';
import { LocalFolder } from '../../types/audio';

interface FolderCardProps {
  folder: LocalFolder;
  onDelete?: (id: string) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, onDelete }) => {
  return (
    <div className="group relative bg-white/30 backdrop-blur-md p-4 rounded-2xl border border-white/40 hover:bg-white/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
          <Folder className="w-8 h-8 text-indigo-600 fill-indigo-600/20" />
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(folder.id);
            }}
            className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Folder"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{folder.name}</h3>
        <div className="flex items-center text-sm text-gray-800 gap-2 font-semibold">
          <Music2 className="w-3 h-3" />
          <span>{folder.songCount} songs</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200/50">
        <p className="text-xs text-gray-400 truncate font-mono">{folder.path}</p>
      </div>
    </div>
  );
};

export default FolderCard;
