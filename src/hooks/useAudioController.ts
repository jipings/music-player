import { invoke } from '@tauri-apps/api/core';

export const audioController = {
  play: async (path: string): Promise<void> => {
    return await invoke<void>('play', { path });
  },

  pause: async (): Promise<void> => {
    return await invoke<void>('pause');
  },

  resume: async (): Promise<void> => {
    return await invoke<void>('resume');
  },

  stop: async (): Promise<void> => {
    return await invoke<void>('stop');
  },

  seek: async (seconds: number): Promise<void> => {
    return await invoke<void>('seek', { seconds });
  },

  setVolume: async (volume: number): Promise<void> => {
    return await invoke<void>('set_volume', { volume });
  },
};

export function useAudioController() {
  return audioController;
}
