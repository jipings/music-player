import React from 'react';
import { Play, ChevronRight } from 'lucide-react';
import { Album } from '../../mockData';

interface LibrarySectionProps {
  title: string;
  items: Album[];
  actionLabel?: string;
  titleSuffix?: React.ReactNode;
  backgroundDecoration?: React.ReactNode;
  onItemClick?: (album: Album) => void;
  onActionClick?: () => void;
}

export const LibrarySection: React.FC<LibrarySectionProps> = ({
  title,
  items,
  actionLabel = 'SEE MORE',
  titleSuffix,
  backgroundDecoration,
  onItemClick,
  onActionClick
}) => {
  return (
    <section className="bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/20 p-8 shadow-2xl overflow-hidden relative">
      {backgroundDecoration}

      <div className="sticky top-0 z-20 flex items-center justify-between mb-8 py-2 px-2 bg-transparent -mx-2">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
          {title}
          {titleSuffix}
        </h2>
        <button
          onClick={onActionClick}
          className="group flex items-center gap-1 text-xs text-indigo-900/70 hover:text-indigo-900 font-black tracking-[0.1em] transition-all bg-white/40 hover:bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/40 shadow-sm"
        >
          {actionLabel}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 relative z-10">
        {items.map((album) => (
          <div
            key={album.id}
            onClick={() => onItemClick?.(album)}
            className="group relative bg-white/20 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/30 hover:bg-white/40 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:border-white/50 transition-all duration-500 cursor-pointer"
          >
            <div className="relative aspect-square mb-5 shadow-2xl rounded-[2rem] overflow-hidden">
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                <div className="bg-white/95 backdrop-blur-2xl rounded-full p-5 shadow-2xl transform transition-all active:scale-90 border border-white/50">
                  <Play className="w-8 h-8 text-indigo-600 fill-current ml-1" />
                </div>
              </div>
            </div>
            <div className="px-2">
              <h3 className="font-black text-gray-900 truncate text-lg tracking-tight mb-0.5">
                {album.title}
              </h3>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.15em] opacity-50 group-hover:opacity-100 transition-opacity">
                {album.artist}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
