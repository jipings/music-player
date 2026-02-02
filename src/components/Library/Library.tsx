import React, { useEffect } from 'react';
import { useAudioStore } from '../../store/audioStore';
import { useUiStore } from '../../store/uiStore';
import { mockAlbums, Album } from '../../mockData';
import { LibrarySection } from './LibrarySection';
import { useTracks } from '../../hooks/useTracks';
import { usePlaylists } from '../../hooks/usePlaylists';
import { useAudioController } from '../../hooks/useAudioController';

const Library: React.FC = () => {
  const { currentTrack, setCurrentTrack } = useAudioStore();
  const { currentView, selectedPlaylistId } = useUiStore();
  const { tracks, getTracks } = useTracks();
  const { playlists, getPlaylists, currentPlaylistTracks, getPlaylistTracks } = usePlaylists();
  const audioController = useAudioController();

  useEffect(() => {
    getTracks();
    getPlaylists();
  }, [getTracks, getPlaylists]);

  useEffect(() => {
    if (currentView === 'playlist' && selectedPlaylistId) {
      getPlaylistTracks(selectedPlaylistId);
    } else if (currentView === 'library') {
      const recent = playlists.find((p) => p.name === 'Recent');
      if (recent) {
        getPlaylistTracks(recent.id);
      }
    }
  }, [currentView, selectedPlaylistId, playlists, getPlaylistTracks]);

  const madeForYouItems = tracks.map((track) => ({
    id: String(track.id),
    title: track.title || track.path.split('/').pop() || 'Unknown Title',
    artist: track.artist || 'Unknown Artist',
    coverUrl: 'https://placehold.co/200/555555/white?text=Track',
  }));

  const playlistItems = currentPlaylistTracks.map((track) => ({
    id: String(track.id),
    title: track.title || track.path.split('/').pop() || 'Unknown Title',
    artist: track.artist || 'Unknown Artist',
    coverUrl: 'https://placehold.co/200/555555/white?text=Track',
  }));

  const handleItemClick = (item: Album) => {
    // Search in current context first, then fallback
    const track =
      currentPlaylistTracks.find((t) => String(t.id) === item.id) ||
      tracks.find((t) => String(t.id) === item.id);

    if (track) {
      audioController.play(track.path);
      setCurrentTrack(track);
    } else {
      console.log('Clicked mock or unknown album:', item.title);
    }
  };
  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);

  return (
    <div className="flex-1 bg-transparent text-gray-900 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1400px] mx-auto">
        {currentView === 'playlist' && selectedPlaylist ? (
          <div className="px-6 pb-12 space-y-12 mt-12">
            <LibrarySection
              title={selectedPlaylist.name}
              items={playlistItems}
              actionLabel="PLAY ALL" // Could be dynamic
              backgroundDecoration={
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
              }
              onItemClick={handleItemClick}
            />
          </div>
        ) : (
          <div className="px-6 pb-12 space-y-12">
            {/* Recently Played */}
            <LibrarySection
              title="Recently Played"
              items={playlistItems}
              actionLabel="EXPLORE ALL"
              titleSuffix={
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
              }
              backgroundDecoration={
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
              }
              onItemClick={handleItemClick}
            />

            {/* Made For You */}

            <LibrarySection
              title="Made For You"
              items={madeForYouItems.length > 0 ? madeForYouItems : [...mockAlbums].reverse()}
              actionLabel="SEE MORE"
              backgroundDecoration={
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>
              }
              onItemClick={handleItemClick}
            />
          </div>
        )}
      </div>

      {currentTrack && (
        <div className="fixed bottom-28 right-10 p-5 bg-indigo-600/80 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 text-white font-black tracking-tight flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          <span className="opacity-60 text-[10px] uppercase tracking-widest">Now Playing</span>
          {currentTrack.title || currentTrack.path.split('/').pop()}
        </div>
      )}
    </div>
  );
};

export default Library;
