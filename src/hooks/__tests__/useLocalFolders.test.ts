import { renderHook, act } from '@testing-library/react';
import { useLocalFolders } from '../useLocalFolders';
import { invoke } from '@tauri-apps/api/core';

// Mock tauri invoke
jest.mock('@tauri-apps/api/core', () => ({
  invoke: jest.fn(),
}));

describe('useLocalFolders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch folders', async () => {
    const mockFolders = [{ id: '1', name: 'Music', path: '/music', songCount: 10 }];
    (invoke as jest.Mock).mockResolvedValueOnce(mockFolders);

    const { result } = renderHook(() => useLocalFolders());

    await act(async () => {
      await result.current.getFolders();
    });

    expect(invoke).toHaveBeenCalledWith('get_folders', { nameFilter: undefined });
    expect(result.current.folders).toEqual(mockFolders);
    expect(result.current.loading).toBe(false);
  });

  it('should add a folder and refresh', async () => {
    (invoke as jest.Mock).mockResolvedValueOnce('new-id'); // add_folder response
    (invoke as jest.Mock).mockResolvedValueOnce([]); // get_folders response

    const { result } = renderHook(() => useLocalFolders());

    await act(async () => {
      await result.current.addFolder('New', '/path');
    });

    expect(invoke).toHaveBeenCalledWith('add_folder', { name: 'New', path: '/path' });
    expect(invoke).toHaveBeenCalledWith('get_folders', { nameFilter: undefined });
  });

  it('should delete folders and refresh', async () => {
    (invoke as jest.Mock).mockResolvedValueOnce(undefined); // delete_folders response
    (invoke as jest.Mock).mockResolvedValueOnce([]); // get_folders response

    const { result } = renderHook(() => useLocalFolders());

    await act(async () => {
      await result.current.deleteFolders(['1']);
    });

    expect(invoke).toHaveBeenCalledWith('delete_folders', { ids: ['1'] });
    expect(invoke).toHaveBeenCalledWith('get_folders', { nameFilter: undefined });
  });
});
