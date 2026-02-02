import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { LocalFolder } from '../types/audio';

export const useLocalFolders = () => {
  const [folders, setFolders] = useState<LocalFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFolders = useCallback(async (nameFilter?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<LocalFolder[]>('get_folders', { nameFilter });
      setFolders(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const addFolder = useCallback(
    async (name: string, path: string) => {
      setLoading(true);
      setError(null);
      try {
        await invoke<string>('add_folder', { name, path });
        await getFolders(); // Refresh list
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getFolders],
  );

  const deleteFolders = useCallback(
    async (ids: string[]) => {
      setLoading(true);
      setError(null);
      try {
        await invoke('delete_folders', { ids });
        await getFolders(); // Refresh list
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getFolders],
  );

  return {
    folders,
    loading,
    error,
    getFolders,
    addFolder,
    deleteFolders,
  };
};
