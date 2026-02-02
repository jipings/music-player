import { create } from 'zustand';
import { Track } from '../types/audio';

interface AudioState {
  isPlaying: boolean;
  playerStatus: 'playing' | 'paused' | 'stopped';
  currentTrack: Track | null;
  volume: number;
  duration: number;
  currentTime: number;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlayerStatus: (status: 'playing' | 'paused' | 'stopped') => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: Track | null) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  playerStatus: 'stopped',
  currentTrack: null,
  volume: 1.0,
  duration: 0,
  currentTime: 0,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlayerStatus: (playerStatus) => set({ playerStatus, isPlaying: playerStatus === 'playing' }),
  setVolume: (volume) => set({ volume }),
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  setDuration: (duration) => set({ duration }),
  setCurrentTime: (currentTime) => set({ currentTime }),
}));
