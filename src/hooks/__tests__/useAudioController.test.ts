import { audioController } from '../useAudioController';
import { invoke } from '@tauri-apps/api/core';

// Mock @tauri-apps/api/core
jest.mock('@tauri-apps/api/core', () => ({
  invoke: jest.fn(),
}));

describe('useAudioController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should invoke play with path', async () => {
    const path = '/test/song.mp3';
    await audioController.play(path);
    expect(invoke).toHaveBeenCalledWith('play', { path });
  });

  it('should invoke pause', async () => {
    await audioController.pause();
    expect(invoke).toHaveBeenCalledWith('pause');
  });

  it('should invoke resume', async () => {
    await audioController.resume();
    expect(invoke).toHaveBeenCalledWith('resume');
  });

  it('should invoke stop', async () => {
    await audioController.stop();
    expect(invoke).toHaveBeenCalledWith('stop');
  });

  it('should invoke seek with seconds', async () => {
    const seconds = 120;
    await audioController.seek(seconds);
    expect(invoke).toHaveBeenCalledWith('seek', { seconds });
  });

  it('should invoke set_volume with volume', async () => {
    const volume = 0.8;
    await audioController.setVolume(volume);
    expect(invoke).toHaveBeenCalledWith('set_volume', { volume });
  });
});
