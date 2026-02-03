import React, { useEffect, useState } from 'react';
import { useAudioStore } from '../../store/audioStore';
import { useUiStore } from '../../store/uiStore';
import { LibrarySection } from './LibrarySection';
import { useTracks } from '../../hooks/useTracks';
import { usePlaylists } from '../../hooks/usePlaylists';
import { useAudioController } from '../../hooks/useAudioController';
import { Track, Album } from '../../types/audio';
import { convertFileSrc } from '@tauri-apps/api/core';

const Library: React.FC = () => {
  const { currentTrack, setCurrentTrack } = useAudioStore();
  const { currentView, selectedPlaylistId } = useUiStore();
  const { tracks, getTracks } = useTracks();
  const { playlists, currentPlaylistTracks, getPlaylistTracks, addTracksToPlaylist } =
    usePlaylists();
  const audioController = useAudioController();

  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [defaultTracks, setDefaultTracks] = useState<Track[]>([]);

  useEffect(() => {
    getTracks();
  }, [getTracks]);

  useEffect(() => {
    const fetchDashboardTracks = async () => {
      if (currentView === 'library') {
        const recent = playlists.find((p) => p.name === 'Recent');
        const defaultPl = playlists.find((p) => p.name === 'Default');

        if (recent) {
          // We can use the existing getPlaylistTracks or a direct invoke if we don't want to mess with global state
          // For the dashboard, local state is better to avoid overwriting currentPlaylistTracks
          import('@tauri-apps/api/core').then(({ invoke }) => {
            invoke<Track[]>('get_tracks_by_playlist', { playlistId: recent.id }).then(
              setRecentTracks,
            );
          });
        }
        if (defaultPl) {
          import('@tauri-apps/api/core').then(({ invoke }) => {
            invoke<Track[]>('get_tracks_by_playlist', { playlistId: defaultPl.id }).then(
              setDefaultTracks,
            );
          });
        }
      }
    };

    if (currentView === 'playlist' && selectedPlaylistId) {
      getPlaylistTracks(selectedPlaylistId);
    } else if (currentView === 'library' && playlists.length > 0) {
      fetchDashboardTracks();
    }
  }, [currentView, selectedPlaylistId, playlists, getPlaylistTracks]);

  const mapTrackToAlbum = (track: Track): Album => ({
    id: String(track.id),
    title: track.title || track.path.split('/').pop() || 'Unknown Title',
    artist: track.artist || 'Unknown Artist',
    coverUrl: track.cover_img_path ? convertFileSrc(track.cover_img_path) : '',
  });

  const madeForYouItems = defaultTracks.map(mapTrackToAlbum);
  const recentItems = recentTracks.map(mapTrackToAlbum);
  const playlistItems = currentPlaylistTracks.map(mapTrackToAlbum);

  const handleItemClick = (item: Album) => {
    // Search in all relevant track lists
    const track =
      currentPlaylistTracks.find((t) => String(t.id) === item.id) ||
      recentTracks.find((t) => String(t.id) === item.id) ||
      defaultTracks.find((t) => String(t.id) === item.id) ||
      tracks.find((t) => String(t.id) === item.id);

    if (track) {
      audioController.play(track.path);
      setCurrentTrack(track);

      // Add to Recent playlist
      const recentPlaylist = playlists.find((p) => p.name === 'Recent');
      if (recentPlaylist) {
        addTracksToPlaylist(recentPlaylist.id, [track.id]);
      }
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
              actionLabel="PLAY ALL"
              backgroundDecoration={
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
              }
              onItemClick={handleItemClick}
            />
          </div>
        ) : (
          <div className="px-6 pb-12 space-y-12 mt-12">
            {/* Recently Played */}
            <LibrarySection
              title="Recently Played"
              items={recentItems}
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
              items={madeForYouItems}
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
