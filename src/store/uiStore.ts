import { create } from 'zustand';

type View = 'home' | 'library' | 'local' | 'settings' | 'playlist';

interface UiState {
  currentView: View;
  selectedPlaylistId: string | null;
  setView: (view: View) => void;
  setSelectedPlaylistId: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentView: 'library',
  selectedPlaylistId: null,
  setView: (view) => set({ currentView: view }),
  setSelectedPlaylistId: (id) => set({ selectedPlaylistId: id }),
}));
