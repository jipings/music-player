import React from 'react';
import { useAudioStore } from '../../store/audioStore';
import { mockAlbums } from '../../mockData';
import { Play } from 'lucide-react';
import { LibrarySection } from './LibrarySection';

const Library: React.FC = () => {
  const { currentTrack } = useAudioStore();

  return (
    <div className="flex-1 bg-transparent text-gray-900 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1400px] mx-auto">
        {/* Hero Section - Advanced Glassmorphism */}
        <div className="relative h-80 bg-white/10 backdrop-blur-2xl border border-white/20 p-10 flex items-end shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] m-6 rounded-[2.5rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-purple-600/20 to-transparent"></div>

          <div className="relative z-10 w-full">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-indigo-500/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-sm">
                Spotlight
              </span>
            </div>
            <h1 className="text-6xl font-black mb-4 text-white tracking-tighter drop-shadow-2xl">
              Midnight <span className="text-indigo-200">Horizons</span>
            </h1>
            <p className="text-white/80 mb-8 max-w-xl text-lg font-medium leading-relaxed drop-shadow-md">
              A journey through neon-lit soundscapes and retro-futuristic rhythms. Discover the
              pulse of the night.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-indigo-900 px-10 py-4 rounded-full font-black hover:scale-105 hover:bg-white active:scale-95 transition-all shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                Listen Now
              </button>
              <button className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-10 py-4 rounded-full font-black hover:bg-white/20 active:scale-95 transition-all flex items-center gap-2">
                View Album
              </button>
            </div>
          </div>

          {/* Decorative glass elements */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-500/30 transition-colors duration-700"></div>
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[60px]"></div>
        </div>

        <div className="px-6 pb-12 space-y-12">
          {/* Recently Played */}
          <LibrarySection
            title="Recently Played"
            items={mockAlbums}
            actionLabel="EXPLORE ALL"
            titleSuffix={
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
            }
            backgroundDecoration={
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
            }
          />

          {/* Made For You */}
          <LibrarySection
            title="Made For You"
            items={[...mockAlbums].reverse()}
            actionLabel="SEE MORE"
            backgroundDecoration={
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>
            }
          />
        </div>
      </div>

      {currentTrack && (
        <div className="fixed bottom-28 right-10 p-5 bg-indigo-600/80 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 text-white font-black tracking-tight flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          <span className="opacity-60 text-[10px] uppercase tracking-widest">Now Playing</span>
          {currentTrack}
        </div>
      )}
    </div>
  );
};

export default Library;
