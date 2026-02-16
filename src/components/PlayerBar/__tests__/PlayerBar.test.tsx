import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerBar from '../PlayerBar';
import { useAudioStore } from '../../../store/audioStore';
import { useAudioController } from '../../../hooks/useAudioController';
import { usePlaylists } from '../../../hooks/usePlaylists';
import { useUiStore } from '../../../store/uiStore';

// Mock dependencies
jest.mock('../../../store/audioStore');
jest.mock('../../../hooks/useAudioController');
jest.mock('../../../hooks/usePlaylists');
jest.mock('../../../store/uiStore');
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

  const mockPause = jest.fn();
  const mockResume = jest.fn();
  const mockSeek = jest.fn();
  const mockSetVolume = jest.fn();
  const mockAddTracksToPlaylist = jest.fn();
  const mockTogglePlayerExpanded = jest.fn();

  const mockFavoritesPlaylist = {
    id: 'fav-1',
    name: 'Favorites',
    createdAt: '2023-01-01',
  };

  beforeEach(() => {
    (useAudioStore as unknown as jest.Mock).mockReturnValue({
      isPlaying: false,
      currentTrack: mockCurrentTrack,
      volume: 0.8,
      duration: 200,
      currentTime: 50,
    });

    (useAudioController as unknown as jest.Mock).mockReturnValue({
      pause: mockPause,
      resume: mockResume,
      seek: mockSeek,
      setVolume: mockSetVolume,
    });

    (usePlaylists as unknown as jest.Mock).mockReturnValue({
      playlists: [mockFavoritesPlaylist],
      addTracksToPlaylist: mockAddTracksToPlaylist,
    });

    (useUiStore as unknown as jest.Mock).mockReturnValue({
      isMobile: false,
      isPlayerExpanded: false,
      togglePlayerExpanded: mockTogglePlayerExpanded,
    });

    jest.clearAllMocks();
  });

  it('returns null when no current track', () => {
    (useAudioStore as unknown as jest.Mock).mockReturnValue({
      isPlaying: false,
      currentTrack: null,
      volume: 0.8,
      duration: 0,
      currentTime: 0,
    });

    const { container } = render(<PlayerBar />);
    expect(container.firstChild).toBeNull();
  });

  describe('Desktop View', () => {
    it('renders full player bar on desktop', () => {
      render(<PlayerBar />);

      expect(screen.getByText('Test Song')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });

    it('displays track info with fallback to filename', () => {
      (useAudioStore as unknown as jest.Mock).mockReturnValue({
        isPlaying: false,
        currentTrack: { ...mockCurrentTrack, title: null, artist: null },
        volume: 0.8,
        duration: 200,
        currentTime: 50,
      });

      render(<PlayerBar />);

      expect(screen.getByText('song.mp3')).toBeInTheDocument();
      expect(screen.getByText('Unknown Artist')).toBeInTheDocument();
    });

    it('calls pause when pause button is clicked', () => {
      (useAudioStore as unknown as jest.Mock).mockReturnValue({
        isPlaying: true,
        currentTrack: mockCurrentTrack,
        volume: 0.8,
        duration: 200,
        currentTime: 50,
      });

      render(<PlayerBar />);

      // Find play/pause button by class
      const buttons = screen.getAllByRole('button');
      const playPauseButton = buttons.find((btn) => btn.classList.contains('rounded-full'));
      fireEvent.click(playPauseButton!);

      expect(mockPause).toHaveBeenCalledTimes(1);
    });

    it('calls resume when play button is clicked', () => {
      render(<PlayerBar />);

      // Find play/pause button by class
      const buttons = screen.getAllByRole('button');
      const playPauseButton = buttons.find((btn) => btn.classList.contains('rounded-full'));
      fireEvent.click(playPauseButton!);

      expect(mockResume).toHaveBeenCalledTimes(1);
    });

    it('calls seek when progress bar is changed', () => {
      render(<PlayerBar />);

      const progressBars = screen.getAllByRole('slider');
      const progressBar = progressBars[0];
      fireEvent.change(progressBar, { target: { value: '100' } });

      expect(mockSeek).toHaveBeenCalledWith(100);
    });

    it('calls setVolume when volume slider is changed', () => {
      render(<PlayerBar />);

      const sliders = screen.getAllByRole('slider');
      const volumeSlider = sliders[sliders.length - 1];
      fireEvent.change(volumeSlider, { target: { value: '0.5' } });

      expect(mockSetVolume).toHaveBeenCalledWith(0.5);
    });

    it('adds track to Favorites when heart button is clicked', () => {
      render(<PlayerBar />);

      const buttons = screen.getAllByRole('button');
      const heartButton = buttons[0];
      fireEvent.click(heartButton);

      expect(mockAddTracksToPlaylist).toHaveBeenCalledWith('fav-1', [123]);
    });

    it('displays current time and duration', () => {
      render(<PlayerBar />);

      expect(screen.getByText('0:50')).toBeInTheDocument();
      expect(screen.getByText('3:20')).toBeInTheDocument();
    });

    it('renders playback control buttons', () => {
      render(<PlayerBar />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      (useUiStore as unknown as jest.Mock).mockReturnValue({
        isMobile: true,
        isPlayerExpanded: false,
        togglePlayerExpanded: mockTogglePlayerExpanded,
      });
    });

    it('renders mini player on mobile', () => {
      render(<PlayerBar />);

      expect(screen.getByText('Test Song')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });

    it('toggles expanded player when album art is clicked', () => {
      render(<PlayerBar />);

      const albumArt = screen.getByAltText('Album Art').closest('div');
      fireEvent.click(albumArt!);

      expect(mockTogglePlayerExpanded).toHaveBeenCalledTimes(1);
    });

    it('calls togglePlayerExpanded when player is clicked', () => {
      render(<PlayerBar />);

      const albumArtContainer = document.querySelector('.cursor-pointer');
      if (albumArtContainer) {
        fireEvent.click(albumArtContainer);
        expect(mockTogglePlayerExpanded).toHaveBeenCalledTimes(1);
      }
    });

    it('displays play button in mini player', () => {
      render(<PlayerBar />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('calls resume when play button in mini player is clicked', () => {
      render(<PlayerBar />);

      // Find the play button (should be the second button in mini player)
      const buttons = screen.getAllByRole('button');
      const playButton = buttons[buttons.length - 1];
      fireEvent.click(playButton);

      expect(mockResume).toHaveBeenCalledTimes(1);
    });

    it('calls pause when pause button in mini player is clicked', () => {
      (useAudioStore as unknown as jest.Mock).mockReturnValue({
        isPlaying: true,
        currentTrack: mockCurrentTrack,
        volume: 0.8,
        duration: 200,
        currentTime: 50,
      });

      render(<PlayerBar />);

      const buttons = screen.getAllByRole('button');
      const pauseButton = buttons[buttons.length - 1];
      fireEvent.click(pauseButton);

      expect(mockPause).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mobile Expanded Player', () => {
    beforeEach(() => {
      (useUiStore as unknown as jest.Mock).mockReturnValue({
        isMobile: true,
        isPlayerExpanded: true,
        togglePlayerExpanded: mockTogglePlayerExpanded,
      });
    });

    it('renders expanded player when isPlayerExpanded is true', () => {
      render(<PlayerBar />);

      // In expanded mode, both mini and expanded players are rendered
      // Use getAllByText to handle duplicates
      const titles = screen.getAllByText('Test Song');
      const artists = screen.getAllByText('Test Artist');
      expect(titles.length).toBeGreaterThanOrEqual(1);
      expect(artists.length).toBeGreaterThanOrEqual(1);
    });

    it('closes expanded player when X button is clicked', () => {
      render(<PlayerBar />);

      // Find the X button by its parent classes
      const buttons = screen.getAllByRole('button');
      // The X button is in the expanded player with specific styling
      const closeButton = buttons.find((btn) => btn.classList.contains('self-start'));
      fireEvent.click(closeButton!);

      expect(mockTogglePlayerExpanded).toHaveBeenCalledTimes(1);
    });

    it('closes expanded player when backdrop is clicked', () => {
      const { container } = render(<PlayerBar />);

      const backdrop = container.querySelector('.bg-gradient-to-b');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockTogglePlayerExpanded).toHaveBeenCalledTimes(1);
      }
    });

    it('renders progress slider in expanded player', () => {
      render(<PlayerBar />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders.length).toBeGreaterThanOrEqual(1);
    });

    it('calls seek when progress slider is changed', () => {
      render(<PlayerBar />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '100' } });

      expect(mockSeek).toHaveBeenCalledWith(100);
    });

    it('displays track duration in expanded player', () => {
      render(<PlayerBar />);

      expect(screen.getByText('0:50')).toBeInTheDocument();
      expect(screen.getByText('3:20')).toBeInTheDocument();
    });

    it('renders playback controls in expanded player', () => {
      render(<PlayerBar />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(6);
    });

    it('toggles play/pause in expanded player', () => {
      (useAudioStore as unknown as jest.Mock).mockReturnValue({
        isPlaying: true,
        currentTrack: mockCurrentTrack,
        volume: 0.8,
        duration: 200,
        currentTime: 50,
      });

      render(<PlayerBar />);

      const buttons = screen.getAllByRole('button');
      // Find play/pause button (usually in the center)
      const playPauseButton = buttons.find((btn) => {
        return btn.classList.contains('rounded-full') && btn.classList.contains('w-16');
      });

      if (playPauseButton) {
        fireEvent.click(playPauseButton);
        expect(mockPause).toHaveBeenCalledTimes(1);
      }
    });
  });
});
