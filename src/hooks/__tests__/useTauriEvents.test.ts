import { renderHook } from '@testing-library/react';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useTauriListen,
  usePlayerStatus,
  usePlayerProgress,
  usePlayerError,
} from '../useTauriEvents';
import { listen } from '@tauri-apps/api/event';

// Mock @tauri-apps/api/event
jest.mock('@tauri-apps/api/event', () => ({
  listen: jest.fn(),
}));

describe('useTauriEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a listener for a generic event', async () => {
    const handler = jest.fn();
    const eventName = 'player-status';
    const unlistenMock = jest.fn();

    (listen as jest.Mock).mockResolvedValue(unlistenMock);

    const { unmount } = renderHook(() => useTauriListen(eventName, handler));

    // Check if listen was called
    expect(listen).toHaveBeenCalledWith(eventName, expect.any(Function));

    // Wait for the async setup to complete
    await waitFor(() => expect(listen).toHaveBeenCalled());

    // Unmount to trigger cleanup
    unmount();

    expect(unlistenMock).toHaveBeenCalled();
  });

  it('should register usePlayerStatus listener', () => {
    const handler = jest.fn();
    renderHook(() => usePlayerStatus(handler));
    expect(listen).toHaveBeenCalledWith('player-status', expect.any(Function));
  });

  it('should register usePlayerProgress listener', () => {
    const handler = jest.fn();
    renderHook(() => usePlayerProgress(handler));
    expect(listen).toHaveBeenCalledWith('player-progress', expect.any(Function));
  });

  it('should register usePlayerError listener', () => {
    const handler = jest.fn();
    renderHook(() => usePlayerError(handler));
    expect(listen).toHaveBeenCalledWith('player-error', expect.any(Function));
  });
});
