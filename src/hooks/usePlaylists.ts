import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Playlist, Track } from '../types/audio';

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPlaylists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<Playlist[]>('get_playlists');
      setPlaylists(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlaylist = useCallback(
    async (name: string) => {
      setLoading(true);
      setError(null);
      try {
        await invoke<string>('create_playlist', { name });
        await getPlaylists();
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getPlaylists],
  );

  const deletePlaylist = useCallback(
    async (playlistId: string) => {
      setLoading(true);
      setError(null);
      try {
        await invoke('delete_playlist', { playlistId });
        await getPlaylists();
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getPlaylists],
  );

  const getPlaylistTracks = useCallback(async (playlistId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<Track[]>('get_tracks_by_playlist', { playlistId });
      setCurrentPlaylistTracks(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const addTracksToPlaylist = useCallback(async (playlistId: string, trackIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      await invoke('add_tracks_to_playlist', { playlistId, trackIds });
      // Optionally refresh current playlist tracks if looking at that playlist
    } catch (err) {
      setError(String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTracksFromPlaylist = useCallback(
    async (playlistId: string, trackIds: number[]) => {
      setLoading(true);
      setError(null);
      try {
        await invoke('delete_tracks_from_playlist', { playlistId, trackIds });
        await getPlaylistTracks(playlistId);
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getPlaylistTracks],
  );

  return {
    playlists,
    currentPlaylistTracks,
    loading,
    error,
    getPlaylists,
    createPlaylist,
    deletePlaylist,
    getPlaylistTracks,
    addTracksToPlaylist,
    deleteTracksFromPlaylist,
  };
};
