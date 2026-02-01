import { invoke } from '@tauri-apps/api/core';
import { PlayArgs, SeekArgs, SetVolumeArgs } from '../types/audio';

export const audioController = {
  play: async (path: string): Promise<void> => {
    return await invoke<void>('play', { path } as PlayArgs);
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
    return await invoke<void>('seek', { seconds } as SeekArgs);
  },

  setVolume: async (volume: number): Promise<void> => {
    return await invoke<void>('set_volume', { volume } as SetVolumeArgs);
  },
};

export function useAudioController() {
  return audioController;
}
