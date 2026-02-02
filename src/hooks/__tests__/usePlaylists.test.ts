import { renderHook, waitFor, act } from '@testing-library/react';
import { usePlaylists } from '../usePlaylists';
import { invoke } from '@tauri-apps/api/core';
import { Playlist, Track } from '../../types/audio';

// Mock invoke
jest.mock('@tauri-apps/api/core', () => ({
  invoke: jest.fn(),
}));

const mockPlaylists: Playlist[] = [
  { id: '1', name: 'Recent', createdAt: '2023-01-01' },
  { id: '2', name: 'Favorites', createdAt: '2023-01-01' },
];

const mockTracks: Track[] = [
  {
    id: 1,
    path: '/music/song1.mp3',
    title: 'Song 1',
    artist: 'Artist 1',
    album: 'Album 1',
    duration_secs: 200,
    has_cover: false,
  },
];

describe('usePlaylists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePlaylists());

    expect(result.current.playlists).toEqual([]);
    expect(result.current.currentPlaylistTracks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch playlists successfully', async () => {
    (invoke as jest.Mock).mockResolvedValue(mockPlaylists);

    const { result } = renderHook(() => usePlaylists());

    await act(async () => {
        await result.current.getPlaylists();
    });

    await waitFor(() => {
        expect(result.current.playlists).toEqual(mockPlaylists);
    });
    
    expect(invoke).toHaveBeenCalledWith('get_playlists');
  });

  it('should create playlist and refresh', async () => {
    (invoke as jest.Mock).mockResolvedValueOnce('new-id').mockResolvedValueOnce([...mockPlaylists, { id: 'new-id', name: 'New List', createdAt: 'now' }]);

    const { result } = renderHook(() => usePlaylists());

    await act(async () => {
      await result.current.createPlaylist('New List');
    });

    expect(invoke).toHaveBeenCalledWith('create_playlist', { name: 'New List' });
    expect(invoke).toHaveBeenCalledWith('get_playlists');
    
    await waitFor(() => {
        expect(result.current.playlists).toHaveLength(3);
    });
  });

  it('should fetch playlist tracks', async () => {
    (invoke as jest.Mock).mockResolvedValue(mockTracks);

    const { result } = renderHook(() => usePlaylists());

    await act(async () => {
      await result.current.getPlaylistTracks('1');
    });

    expect(invoke).toHaveBeenCalledWith('get_tracks_by_playlist', { playlistId: '1' });
    
    await waitFor(() => {
        expect(result.current.currentPlaylistTracks).toEqual(mockTracks);
    });
  });
});
