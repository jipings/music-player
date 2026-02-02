import { renderHook, waitFor, act } from '@testing-library/react';
import { useTracks } from '../useTracks';
import { invoke } from '@tauri-apps/api/core';
import { Track } from '../../types/audio';

// Mock the invoke function
jest.mock('@tauri-apps/api/core', () => ({
  invoke: jest.fn(),
}));

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
  {
    id: 2,
    path: '/music/song2.mp3',
    title: 'Song 2',
    artist: 'Artist 2',
    album: 'Album 2',
    duration_secs: 180,
    has_cover: true,
    cover_mime: 'image/jpeg',
  },
];

describe('useTracks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useTracks());

    expect(result.current.tracks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch tracks successfully', async () => {
    (invoke as jest.Mock).mockResolvedValue(mockTracks);

    const { result } = renderHook(() => useTracks());

    await act(async () => {
      await result.current.getTracks();
    });

    await waitFor(() => {
      expect(result.current.tracks).toEqual(mockTracks);
    });

    expect(invoke).toHaveBeenCalledWith('get_tracks', { titleFilter: undefined });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors when fetching tracks', async () => {
    const errorMessage = 'Failed to fetch tracks';
    (invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTracks());

    await act(async () => {
      await result.current.getTracks();
    });

    await waitFor(() => {
      expect(result.current.error).toContain(errorMessage);
    });

    expect(invoke).toHaveBeenCalledWith('get_tracks', { titleFilter: undefined });
    expect(result.current.tracks).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should call getTracks with filter', async () => {
    (invoke as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useTracks());

    await act(async () => {
      await result.current.getTracks('Love');
    });

    expect(invoke).toHaveBeenCalledWith('get_tracks', { titleFilter: 'Love' });
  });
});
