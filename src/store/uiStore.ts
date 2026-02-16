import { create } from 'zustand';

export type View = 'home' | 'library' | 'local' | 'settings' | 'playlist';

interface UiState {
  currentView: View;
  selectedPlaylistId: string | null;
  isMobile: boolean;
  isSidebarOpen: boolean;
  isPlayerExpanded: boolean;
  setView: (view: View) => void;
  setSelectedPlaylistId: (id: string | null) => void;
  setMobile: (isMobile: boolean) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  togglePlayerExpanded: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentView: 'library',
  selectedPlaylistId: null,
  isMobile: false,
  isSidebarOpen: false,
  isPlayerExpanded: false,
  setView: (view) => set({ currentView: view }),
  setSelectedPlaylistId: (id) => set({ selectedPlaylistId: id }),
  setMobile: (isMobile) => set({ isMobile }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  togglePlayerExpanded: () => set((state) => ({ isPlayerExpanded: !state.isPlayerExpanded })),
}));
