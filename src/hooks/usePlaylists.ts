import { useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Playlist, Track } from '../types/audio';
import { usePlaylistStore } from '../store/playlistStore';

export const usePlaylists = () => {
  const {
    playlists,
    currentPlaylistTracks,
    loading,
    error,
    setPlaylists,
    setCurrentPlaylistTracks,
    setLoading,
    setError,
  } = usePlaylistStore();

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
  }, [setPlaylists, setError, setLoading]);

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
    [getPlaylists, setError, setLoading],
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
    [getPlaylists, setError, setLoading],
  );

  const getPlaylistTracks = useCallback(
    async (playlistId: string) => {
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
    },
    [setCurrentPlaylistTracks, setError, setLoading],
  );

  const addTracksToPlaylist = useCallback(
    async (playlistId: string, trackIds: number[]) => {
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
    },
    [setError, setLoading],
  );

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
    [getPlaylistTracks, setError, setLoading],
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
