import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Track } from '../types/audio';

export const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTracks = useCallback(async (titleFilter?: string) => {
    setLoading(true);
    setError(null);
    try {
      // The backend argument name in Rust struct is `title_filter` if it was struct,
      // but in `#[command] fn get_tracks(title_filter: Option<String>, ...)`
      // Tauri 2.0 uses camelCase for arguments by default in invocation?
      // Wait, in `add_folder` it was `name, path`.
      // In `get_folders` it was `name_filter`.
      // Tauri 1.x auto-converts camelCase (JS) to snake_case (Rust) arguments.
      // Let's assume Tauri 2.0 does the same.
      const result = await invoke<Track[]>('get_tracks', { titleFilter });
      setTracks(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tracks,
    loading,
    error,
    getTracks,
  };
};
