import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerBar from '../PlayerBar';
import { useAudioStore } from '../../../store/audioStore';
import { usePlaylists } from '../../../hooks/usePlaylists';

// Mock dependencies
jest.mock('../../../store/audioStore');
jest.mock('../../../hooks/useAudioController', () => ({
  useAudioController: () => ({
    pause: jest.fn(),
    resume: jest.fn(),
    seek: jest.fn(),
    setVolume: jest.fn(),
  }),
}));
jest.mock('../../../hooks/usePlaylists');
jest.mock('@tauri-apps/api/core', () => ({
  convertFileSrc: (path: string) => `mock-src:${path}`,
}));

describe('PlayerBar', () => {
  const mockCurrentTrack = {
    id: 123,
    title: 'Test Song',
    artist: 'Test Artist',
    path: '/path/to/song.mp3',
    duration_secs: 200,
    has_cover: true,
    cover_img_path: '/path/to/cover.jpg',
  };

  const mockFavoritesPlaylist = {
    id: 'fav-1',
    name: 'Favorites',
    createdAt: '2023-01-01',
  };

  const mockAddTracksToPlaylist = jest.fn();

  beforeEach(() => {
    (useAudioStore as unknown as jest.Mock).mockReturnValue({
      isPlaying: true,
      currentTrack: mockCurrentTrack,
      volume: 1,
      duration: 200,
      currentTime: 50,
    });

    (usePlaylists as unknown as jest.Mock).mockReturnValue({
      playlists: [mockFavoritesPlaylist],
      addTracksToPlaylist: mockAddTracksToPlaylist,
    });

    jest.clearAllMocks();
  });

  it('adds track to Favorites playlist when heart button is clicked', async () => {
    render(<PlayerBar />);

    // The heart button is the first button in the component
    const buttons = screen.getAllByRole('button');
    const heartBtn = buttons[0];

    fireEvent.click(heartBtn);

    expect(mockAddTracksToPlaylist).toHaveBeenCalledWith('fav-1', [123]);
  });

  it('does nothing if Favorites playlist is not found', async () => {
    (usePlaylists as unknown as jest.Mock).mockReturnValue({
      playlists: [], // No favorites
      addTracksToPlaylist: mockAddTracksToPlaylist,
    });

    // Silence console.warn
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(<PlayerBar />);
    const buttons = screen.getAllByRole('button');
    const heartBtn = buttons[0];

    fireEvent.click(heartBtn);

    expect(mockAddTracksToPlaylist).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Favorites playlist not found');

    consoleSpy.mockRestore();
  });
});
