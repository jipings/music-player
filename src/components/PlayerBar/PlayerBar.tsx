import React from 'react';
import { useAudioStore } from '../../store/audioStore';

const PlayerBar: React.FC = () => {
  const { isPlaying, setIsPlaying, volume, setVolume } = useAudioStore();

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: Invoke Tauri command to play/pause
  };

  return (
    <div className="h-20 bg-gray-900 text-white border-t border-gray-700 flex items-center justify-between px-6">
      <div className="w-1/3">
        <div className="font-semibold">Track Title</div>
        <div className="text-xs text-gray-400">Artist</div>
      </div>

      <div className="w-1/3 flex flex-col items-center">
        <div className="flex items-center space-x-6 mb-2">
          <button className="text-gray-400 hover:text-white">Previous</button>
          <button
            className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform"
            onClick={togglePlay}
          >
            {isPlaying ? '||' : '▶'}
          </button>
          <button className="text-gray-400 hover:text-white">Next</button>
        </div>
        <div className="w-full max-w-md flex items-center space-x-2 text-xs text-gray-400">
          <span>0:00</span>
          <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div className="w-0 h-full bg-white"></div>
          </div>
          <span>3:45</span>
        </div>
      </div>

      <div className="w-1/3 flex justify-end items-center space-x-4">
        <span className="text-xs">Vol</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 accent-blue-500"
        />
      </div>
    </div>
  );
};

export default PlayerBar;
