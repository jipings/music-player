import { useAudioStore } from '../store/audioStore';
import { usePlayerStatus, usePlayerProgress, usePlayerError } from './useTauriEvents';

export const usePlayerSync = () => {
  const { setPlayerStatus, setDuration, setCurrentTime } = useAudioStore();

  usePlayerStatus((payload) => {
    console.log('Player Status:', payload);
    setPlayerStatus(payload.status);
    if (payload.duration !== undefined) {
      setDuration(payload.duration);
    }
  });

  usePlayerProgress((payload) => {
    setCurrentTime(payload.position);
    setDuration(payload.duration);
  });

  usePlayerError((error) => {
    console.error('Player Error:', error);
    alert(error);
    // Optionally set an error state in the store
  });
};
