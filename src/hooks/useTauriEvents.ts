import { useEffect } from 'react';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { PlayerStatusPayload, PlayerProgressPayload, PlayerErrorPayload } from '../types/audio';

type EventName = 'player-status' | 'player-progress' | 'player-error';

export function useTauriListen<T>(event: EventName, handler: (payload: T) => void) {
  useEffect(() => {
    let unlisten: UnlistenFn | undefined;

    const setupListener = async () => {
      unlisten = await listen<T>(event, (event) => {
        handler(event.payload);
      });
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [event, handler]);
}

export function usePlayerStatus(handler: (status: PlayerStatusPayload) => void) {
  useTauriListen<PlayerStatusPayload>('player-status', handler);
}

export function usePlayerProgress(handler: (progress: PlayerProgressPayload) => void) {
  useTauriListen<PlayerProgressPayload>('player-progress', handler);
}

export function usePlayerError(handler: (error: PlayerErrorPayload) => void) {
  useTauriListen<PlayerErrorPayload>('player-error', handler);
}
