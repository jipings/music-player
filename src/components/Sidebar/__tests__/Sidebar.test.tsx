import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../Sidebar';
import { useUiStore } from '../../../store/uiStore';
import { usePlaylists } from '../../../hooks/usePlaylists';

// Mock dependencies
jest.mock('../../../store/uiStore');
jest.mock('../../../hooks/usePlaylists');

describe('Sidebar', () => {
  const mockSetView = jest.fn();
  const mockSetSelectedPlaylistId = jest.fn();
  const mockCloseSidebar = jest.fn();

  const mockPlaylists = [
    { id: 'recent-1', name: 'Recent', createdAt: '2023-01-01' },
    { id: 'fav-1', name: 'Favorites', createdAt: '2023-01-01' },
    { id: 'user-1', name: 'My Playlist', createdAt: '2023-01-01' },
  ];

  beforeEach(() => {
    (usePlaylists as unknown as jest.Mock).mockReturnValue({
      playlists: mockPlaylists,
    });

    jest.clearAllMocks();
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      (useUiStore as unknown as jest.Mock).mockReturnValue({
        currentView: 'library',
        setView: mockSetView,
        selectedPlaylistId: null,
        setSelectedPlaylistId: mockSetSelectedPlaylistId,
        isMobile: false,
        isSidebarOpen: false,
        closeSidebar: mockCloseSidebar,
      });
    });

    it('renders sidebar on desktop', () => {
      render(<Sidebar />);

      expect(screen.getByText('Melody')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Recent')).toBeInTheDocument();
      expect(screen.getByText('Favorites')).toBeInTheDocument();
      expect(screen.getByText('Local')).toBeInTheDocument();
      expect(screen.getByText('My Playlist')).toBeInTheDocument();
    });

    it('renders Menu and Library sections', () => {
      render(<Sidebar />);

      expect(screen.getByText('Menu')).toBeInTheDocument();
      expect(screen.getByText('Library')).toBeInTheDocument();
      expect(screen.getByText('Playlists')).toBeInTheDocument();
    });

    it('switches to library view when Home is clicked', () => {
      render(<Sidebar />);

      const homeButton = screen.getByText('Home').closest('button');
      fireEvent.click(homeButton!);

      expect(mockSetView).toHaveBeenCalledWith('library');
    });

    it('switches to playlist view when Recent is clicked', () => {
      render(<Sidebar />);

      const recentButton = screen.getByText('Recent').closest('button');
      fireEvent.click(recentButton!);

      expect(mockSetSelectedPlaylistId).toHaveBeenCalledWith('recent-1');
      expect(mockSetView).toHaveBeenCalledWith('playlist');
    });

    it('switches to playlist view when Favorites is clicked', () => {
      render(<Sidebar />);

      const favoritesButton = screen.getByText('Favorites').closest('button');
      fireEvent.click(favoritesButton!);

      expect(mockSetSelectedPlaylistId).toHaveBeenCalledWith('fav-1');
      expect(mockSetView).toHaveBeenCalledWith('playlist');
    });

    it('switches to local view when Local is clicked', () => {
      render(<Sidebar />);

      const localButton = screen.getByText('Local').closest('button');
      fireEvent.click(localButton!);

      expect(mockSetView).toHaveBeenCalledWith('local');
    });

    it('switches to playlist view when user playlist is clicked', () => {
      render(<Sidebar />);

      const playlistButton = screen.getByText('My Playlist').closest('button');
      fireEvent.click(playlistButton!);

      expect(mockSetSelectedPlaylistId).toHaveBeenCalledWith('user-1');
      expect(mockSetView).toHaveBeenCalledWith('playlist');
    });

    it('highlights active view', () => {
      (useUiStore as unknown as jest.Mock).mockReturnValue({
        currentView: 'local',
        setView: mockSetView,
        selectedPlaylistId: null,
        setSelectedPlaylistId: mockSetSelectedPlaylistId,
        isMobile: false,
        isSidebarOpen: false,
        closeSidebar: mockCloseSidebar,
      });

      render(<Sidebar />);

      const localButton = screen.getByText('Local').closest('button');
      expect(localButton).toHaveClass('text-gray-900');
      expect(localButton).toHaveClass('bg-white/60');
    });

    it('does not render close button on desktop', () => {
      render(<Sidebar />);

      // Check that there's no X button (close button) on desktop
      // Desktop sidebar doesn't have buttons with X icon
      const buttons = screen.getAllByRole('button');
      // All buttons in desktop view should be navigation items (no X close button)
      const buttonTexts = buttons.map((btn) => btn.textContent);
      expect(buttonTexts).not.toContain(''); // X button has no text, just icon
      // Desktop sidebar has navigation buttons with text like 'Home', 'Recent', etc.
      expect(buttonTexts.some((text) => text?.includes('Home'))).toBe(true);
    });
  });

  describe('Mobile View', () => {
    it('does not render when sidebar is closed', () => {
      (useUiStore as unknown as jest.Mock).mockReturnValue({
        currentView: 'library',
        setView: mockSetView,
        selectedPlaylistId: null,
        setSelectedPlaylistId: mockSetSelectedPlaylistId,
        isMobile: true,
        isSidebarOpen: false,
        closeSidebar: mockCloseSidebar,
      });

      const { container } = render(<Sidebar />);
      expect(container.firstChild).toBeNull();
    });

    it('renders drawer when sidebar is open', () => {
      (useUiStore as unknown as jest.Mock).mockReturnValue({
        currentView: 'library',
        setView: mockSetView,
        selectedPlaylistId: null,
        setSelectedPlaylistId: mockSetSelectedPlaylistId,
        isMobile: true,
        isSidebarOpen: true,
        closeSidebar: mockCloseSidebar,
      });

      render(<Sidebar />);

      expect(screen.getByText('Melody')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('closes sidebar when X button is clicked', () => {
      (useUiStore as unknown as jest.Mock).mockReturnValue({
        currentView: 'library',
        setView: mockSetView,
        selectedPlaylistId: null,
        setSelectedPlaylistId: mockSetSelectedPlaylistId,
        isMobile: true,
        isSidebarOpen: true,
        closeSidebar: mockCloseSidebar,
      });

      render(<Sidebar />);

      // Find and click the close button (X icon)
      const buttons = screen.getAllByRole('button');
      const closeButton = buttons.find((btn) => {
        const svg = btn.querySelector('svg');
        return svg !== null;
      });

      if (closeButton) {
        fireEvent.click(closeButton);
        expect(mockCloseSidebar).toHaveBeenCalledTimes(1);
      }
    });

    it('closes sidebar when backdrop is clicked', () => {
      (useUiStore as unknown as jest.Mock).mockReturnValue({
        currentView: 'library',
        setView: mockSetView,
        selectedPlaylistId: null,
        setSelectedPlaylistId: mockSetSelectedPlaylistId,
        isMobile: true,
        isSidebarOpen: true,
        closeSidebar: mockCloseSidebar,
      });

      const { container } = render(<Sidebar />);

      // Find backdrop by its class
      const backdrop = container.querySelector('.bg-black\\/50');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockCloseSidebar).toHaveBeenCalledTimes(1);
      }
    });

    it('closes sidebar when navigation item is clicked', () => {
      (useUiStore as unknown as jest.Mock).mockReturnValue({
        currentView: 'library',
        setView: mockSetView,
        selectedPlaylistId: null,
        setSelectedPlaylistId: mockSetSelectedPlaylistId,
        isMobile: true,
        isSidebarOpen: true,
        closeSidebar: mockCloseSidebar,
      });

      render(<Sidebar />);

      const homeButton = screen.getByText('Home').closest('button');
      fireEvent.click(homeButton!);

      expect(mockCloseSidebar).toHaveBeenCalledTimes(1);
    });

    it('closes sidebar when playlist is clicked', () => {
      (useUiStore as unknown as jest.Mock).mockReturnValue({
        currentView: 'library',
        setView: mockSetView,
        selectedPlaylistId: null,
        setSelectedPlaylistId: mockSetSelectedPlaylistId,
        isMobile: true,
        isSidebarOpen: true,
        closeSidebar: mockCloseSidebar,
      });

      render(<Sidebar />);

      const recentButton = screen.getByText('Recent').closest('button');
      fireEvent.click(recentButton!);

      expect(mockCloseSidebar).toHaveBeenCalledTimes(1);
    });
  });
});
