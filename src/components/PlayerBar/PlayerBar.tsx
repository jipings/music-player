import React from 'react';
import { useAudioStore } from '../../store/audioStore';
import { useAudioController } from '../../hooks/useAudioController';
import { usePlaylists } from '../../hooks/usePlaylists';
import { useUiStore } from '../../store/uiStore';
import { convertFileSrc } from '@tauri-apps/api/core';
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
  X,
} from 'lucide-react';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const PlayerBar: React.FC = () => {
  const { isPlaying, currentTrack, volume, duration, currentTime } = useAudioStore();
  const audioController = useAudioController();
  const { playlists, addTracksToPlaylist } = usePlaylists();
  const { isMobile, isPlayerExpanded, togglePlayerExpanded } = useUiStore();

  const togglePlay = () => {
    if (isPlaying) {
      audioController.pause();
    } else {
      if (currentTrack) {
        audioController.resume();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    audioController.seek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    audioController.setVolume(vol);
  };

  const handleAddToFavorites = async () => {
    if (!currentTrack) return;
    const favorites = playlists.find((p) => p.name === 'Favorites');
    if (favorites) {
      await addTracksToPlaylist(favorites.id, [currentTrack.id]);
    } else {
      console.warn('Favorites playlist not found');
    }
  };

  if (!currentTrack) return null;

  if (isMobile) {
    return (
      <>
        <div className="fixed bottom-[72px] left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-white/30 shadow-2xl z-30 px-4 py-3 safe-area-inset-bottom">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
              onClick={togglePlayerExpanded}
            >
              <img
                hidden={!currentTrack.cover_img_path}
                src={currentTrack.cover_img_path && convertFileSrc(currentTrack.cover_img_path)}
                alt="Album Art"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate text-gray-900">
                {currentTrack.title || currentTrack.path.split('/').pop()}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {currentTrack.artist || 'Unknown Artist'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={handleAddToFavorites}
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isPlayerExpanded && (
          <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-gradient-to-b from-indigo-600 via-purple-700 to-black"
              onClick={togglePlayerExpanded}
            />
            <div className="relative h-full flex flex-col p-6">
              <button
                onClick={togglePlayerExpanded}
                className="self-start p-3 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12">
                <div className="w-72 h-72 bg-white/10 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <img
                    hidden={!currentTrack.cover_img_path}
                    src={currentTrack.cover_img_path && convertFileSrc(currentTrack.cover_img_path)}
                    alt="Album Art"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center w-full px-4">
                  <div className="text-2xl font-bold text-white mb-2 truncate">
                    {currentTrack.title || currentTrack.path.split('/').pop()}
                  </div>
                  <div className="text-lg text-white/80">
                    {currentTrack.artist || 'Unknown Artist'}
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex items-center justify-between text-xs text-white/60 font-mono px-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 1}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:accent-indigo-300"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />

                <div className="flex items-center justify-center gap-6 pt-4">
                  <button className="text-white/80 hover:text-white transition-colors p-2">
                    <Shuffle className="w-6 h-6" />
                  </button>
                  <button className="text-white hover:text-white transition-colors p-2">
                    <SkipBack className="w-8 h-8 fill-current" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center hover:scale-105 transition-transform shadow-2xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 fill-current ml-1" />
                    )}
                  </button>
                  <button className="text-white hover:text-white transition-colors p-2">
                    <SkipForward className="w-8 h-8 fill-current" />
                  </button>
                  <button className="text-white/80 hover:text-white transition-colors p-2">
                    <Repeat className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="h-24 bg-white/60 backdrop-blur-xl text-gray-900 border-t border-white/30 flex items-center justify-between px-6 z-50 shadow-2xl">
      <div className="w-1/3 flex items-center gap-4">
        <div className="w-14 h-14 bg-white/50 rounded overflow-hidden shadow-sm border border-white/40">
          <img
            hidden={!currentTrack.cover_img_path}
            src={currentTrack.cover_img_path && convertFileSrc(currentTrack.cover_img_path)}
            alt="Album Art"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-semibold text-sm hover:underline cursor-pointer truncate max-w-[200px]">
            {currentTrack.title || currentTrack.path.split('/').pop()}
          </div>
          <div className="text-xs text-gray-600 hover:text-gray-900 hover:underline cursor-pointer truncate max-w-[200px]">
            {currentTrack.artist || 'Unknown Artist'}
          </div>
        </div>
        <button
          className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
          onClick={handleAddToFavorites}
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="w-1/3 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-6 mb-2">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Shuffle className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Repeat className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center space-x-2 text-xs text-gray-600 font-mono">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 1}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-gray-400/50 rounded-lg appearance-none cursor-pointer accent-gray-900 hover:accent-indigo-600"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

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
            onChange={handleVolumeChange}
            className="w-full h-1 bg-gray-400/50 rounded-lg appearance-none cursor-pointer accent-gray-900 hover:accent-indigo-600"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
