import { create } from 'zustand';

type View = 'home' | 'library' | 'local' | 'settings';

interface UiState {
  currentView: View;
  setView: (view: View) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentView: 'library',
  setView: (view) => set({ currentView: view }),
}));
