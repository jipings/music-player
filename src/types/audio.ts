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

export interface Track {
  id: number;
  path: string;
  title?: string;
  artist?: string;
  album?: string;
  duration_secs: number;
  cover_mime?: string;
  has_cover: boolean;
  cover_img_path?: string;
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: string;
}
