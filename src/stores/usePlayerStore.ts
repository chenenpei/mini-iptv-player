import type { PlayerStatus } from "@/types/player";
import { create } from "zustand";

interface PlayerStoreState {
  // Current channel
  currentChannelId: string | null;
  setCurrentChannelId: (channelId: string | null) => void;

  // Player status
  status: PlayerStatus;
  setStatus: (status: PlayerStatus) => void;

  // Controls
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;

  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  toggleMute: () => void;

  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  toggleFullscreen: () => void;

  // Loading and error
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;

  // Reset player state
  reset: () => void;
}

const initialState = {
  currentChannelId: null,
  status: "idle" as PlayerStatus,
  isPlaying: false,
  isMuted: false,
  isFullscreen: false,
  isLoading: false,
  error: null,
};

export const usePlayerStore = create<PlayerStoreState>((set) => ({
  ...initialState,

  setCurrentChannelId: (channelId) =>
    set({ currentChannelId: channelId, error: null, isLoading: true }),

  setStatus: (status) => set({ status }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setIsMuted: (muted) => set({ isMuted: muted }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () => set(initialState),
}));
