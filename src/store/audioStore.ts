import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  currentTrack: string | null;
  volume: number;
  duration: number;
  currentTime: number;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: string | null) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  currentTrack: null,
  volume: 1.0,
  duration: 0,
  currentTime: 0,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  setDuration: (duration) => set({ duration }),
  setCurrentTime: (currentTime) => set({ currentTime }),
}));
