import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BottomNav from '../BottomNav';
import { useUiStore } from '../../../store/uiStore';
import { usePlaylists } from '../../../hooks/usePlaylists';

// Mock dependencies
jest.mock('../../../store/uiStore');
jest.mock('../../../hooks/usePlaylists');

describe('BottomNav', () => {
  const mockSetView = jest.fn();
  const mockToggleSidebar = jest.fn();
  const mockSetSelectedPlaylistId = jest.fn();

  const mockPlaylists = [
    { id: 'recent-1', name: 'Recent', createdAt: '2023-01-01' },
    { id: 'fav-1', name: 'Favorites', createdAt: '2023-01-01' },
    { id: 'user-1', name: 'My Playlist', createdAt: '2023-01-01' },
  ];

  beforeEach(() => {
    (useUiStore as unknown as jest.Mock).mockReturnValue({
      currentView: 'library',
      setView: mockSetView,
      toggleSidebar: mockToggleSidebar,
      selectedPlaylistId: null,
      setSelectedPlaylistId: mockSetSelectedPlaylistId,
    });

    (usePlaylists as unknown as jest.Mock).mockReturnValue({
      playlists: mockPlaylists,
    });

    jest.clearAllMocks();
  });

  it('renders all navigation items', () => {
    render(<BottomNav />);

    // Check for all navigation buttons with their labels
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Recent')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Local')).toBeInTheDocument();
  });

  it('toggles sidebar when menu button is clicked', () => {
    render(<BottomNav />);

    const menuButton = screen.getByText('Menu').closest('button');
    fireEvent.click(menuButton!);

    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('switches to library view when Home is clicked', () => {
    render(<BottomNav />);

    const homeButton = screen.getByText('Home').closest('button');
    fireEvent.click(homeButton!);

    expect(mockSetView).toHaveBeenCalledWith('library');
  });

  it('switches to local view when Local is clicked', () => {
    render(<BottomNav />);

    const localButton = screen.getByText('Local').closest('button');
    fireEvent.click(localButton!);

    expect(mockSetView).toHaveBeenCalledWith('local');
  });

  it('handles Recent playlist click correctly', () => {
    render(<BottomNav />);

    const recentButton = screen.getByText('Recent').closest('button');
    fireEvent.click(recentButton!);

    expect(mockSetSelectedPlaylistId).toHaveBeenCalledWith('recent-1');
    expect(mockSetView).toHaveBeenCalledWith('playlist');
  });

  it('handles Favorites playlist click correctly', () => {
    render(<BottomNav />);

    const favoritesButton = screen.getByText('Favorites').closest('button');
    fireEvent.click(favoritesButton!);

    expect(mockSetSelectedPlaylistId).toHaveBeenCalledWith('fav-1');
    expect(mockSetView).toHaveBeenCalledWith('playlist');
  });

  it('shows active state for current view', () => {
    (useUiStore as unknown as jest.Mock).mockReturnValue({
      currentView: 'local',
      setView: mockSetView,
      toggleSidebar: mockToggleSidebar,
      selectedPlaylistId: null,
      setSelectedPlaylistId: mockSetSelectedPlaylistId,
    });

    render(<BottomNav />);

    const localButton = screen.getByText('Local').closest('button');
    expect(localButton).toHaveClass('text-indigo-600');
  });

  it('shows active state for selected playlist', () => {
    (useUiStore as unknown as jest.Mock).mockReturnValue({
      currentView: 'playlist',
      setView: mockSetView,
      toggleSidebar: mockToggleSidebar,
      selectedPlaylistId: 'recent-1',
      setSelectedPlaylistId: mockSetSelectedPlaylistId,
    });

    render(<BottomNav />);

    const recentButton = screen.getByText('Recent').closest('button');
    expect(recentButton).toHaveClass('text-indigo-600');
  });

  it('does not break if Recent playlist is missing', () => {
    (usePlaylists as unknown as jest.Mock).mockReturnValue({
      playlists: [{ id: 'fav-1', name: 'Favorites', createdAt: '2023-01-01' }],
    });

    // Should not throw
    expect(() => render(<BottomNav />)).not.toThrow();
  });
});
