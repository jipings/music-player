import { create } from 'zustand';
import { Playlist, Track } from '../types/audio';

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylistTracks: Track[];
  loading: boolean;
  error: string | null;
  setPlaylists: (playlists: Playlist[]) => void;
  setCurrentPlaylistTracks: (tracks: Track[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  playlists: [],
  currentPlaylistTracks: [],
  loading: false,
  error: null,
  setPlaylists: (playlists) => set({ playlists }),
  setCurrentPlaylistTracks: (tracks) => set({ currentPlaylistTracks: tracks }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
