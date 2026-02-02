export interface PlayerStatusPayload {
  status: 'playing' | 'paused' | 'stopped';
  path?: string;
  duration?: number;
}

export interface PlayerProgressPayload {
  position: number;
  duration: number;
}

export type PlayerErrorPayload = string;

// Command Types matching backend
export interface PlayArgs {
  path: string;
}

export interface SeekArgs {
  seconds: number;
}

export interface SetVolumeArgs {
  volume: number;
}

export interface LocalFolder {
  id: string;
  name: string;
  path: string;
  songCount: number;
}
