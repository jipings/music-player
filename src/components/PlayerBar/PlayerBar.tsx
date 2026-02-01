import React from 'react';
import { useAudioStore } from '../../store/audioStore';
import {
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  ListMusic,
  Volume2,
} from 'lucide-react';

const PlayerBar: React.FC = () => {
  const { isPlaying, setIsPlaying, volume, setVolume } = useAudioStore();

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: Invoke Tauri command to play/pause
  };

  return (
    <div className="h-24 bg-white/60 backdrop-blur-xl text-gray-900 border-t border-white/30 flex items-center justify-between px-6 z-50 shadow-2xl">
      {/* Track Info */}
      <div className="w-1/3 flex items-center gap-4">
        <div className="w-14 h-14 bg-white/50 rounded overflow-hidden shadow-sm border border-white/40">
          <img
            src="https://placehold.co/56/2a2a2a/white?text=MH"
            alt="Album Art"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-semibold text-sm hover:underline cursor-pointer">
            Midnight Horizons
          </div>
          <div className="text-xs text-gray-600 hover:text-gray-900 hover:underline cursor-pointer">
            Luna Echo
          </div>
        </div>
        <button className="ml-2 text-gray-500 hover:text-red-500">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Controls */}
      <div className="w-1/3 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-6 mb-2">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Shuffle className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <SkipBack className="w-6 h-6" fill="currentColor" />
          </button>
          <button
            className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <SkipForward className="w-6 h-6" fill="currentColor" />
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Repeat className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center space-x-2 text-xs text-gray-600 font-mono">
          <span>1:42</span>
          <div className="flex-1 h-1 bg-gray-400/50 rounded-full overflow-hidden group cursor-pointer">
            <div className="w-1/3 h-full bg-gray-900 group-hover:bg-indigo-600 transition-colors"></div>
          </div>
          <span>3:45</span>
        </div>
      </div>

      {/* Volume / Extra Controls */}
      <div className="w-1/3 flex justify-end items-center space-x-4 pr-2">
        <button className="text-gray-600 hover:text-gray-900">
          <ListMusic className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2 w-32">
          <Volume2 className="w-5 h-5 text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-400/50 rounded-lg appearance-none cursor-pointer accent-gray-900 hover:accent-indigo-600"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
