import { useCallback, useEffect } from "react";
import { usePlayerStore } from "@stores/usePlayerStore";
import { useOrientation } from "./useOrientation";

export function usePlayer(channelId: string, channelUrl: string) {
  const {
    status,
    setStatus,
    isPlaying,
    setIsPlaying,
    togglePlay,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    isFullscreen,
    toggleFullscreen,
    setIsFullscreen,
    isLoading,
    setIsLoading,
    error,
    setError,
    setCurrentChannelId,
    reset,
  } = usePlayerStore();

  const { lockToLandscape, lockToPortrait } = useOrientation();

  // Initialize player when channel changes
  useEffect(() => {
    setCurrentChannelId(channelId);
    setIsLoading(true);
    setError(null);
    setIsPlaying(true); // Auto-play when channel is set

    return () => {
      reset();
    };
  }, [channelId, setCurrentChannelId, setIsLoading, setError, setIsPlaying, reset]);

  // Handle fullscreen orientation
  useEffect(() => {
    if (isFullscreen) {
      lockToLandscape();
    } else {
      lockToPortrait();
    }
  }, [isFullscreen, lockToLandscape, lockToPortrait]);

  // Event handlers
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setStatus("ready");
  }, [setIsLoading, setStatus]);

  const handleBuffer = useCallback(
    (buffering: boolean) => {
      setIsLoading(buffering);
      setStatus(buffering ? "loading" : isPlaying ? "playing" : "paused");
    },
    [setIsLoading, setStatus, isPlaying]
  );

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      setStatus("error");
      setIsPlaying(false);
    },
    [setError, setStatus, setIsPlaying]
  );

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setIsPlaying(true);
    // Force re-render by updating status
    setStatus("loading");
  }, [setError, setIsLoading, setIsPlaying, setStatus]);

  const handlePlayPause = useCallback(() => {
    togglePlay();
    setStatus(isPlaying ? "paused" : "playing");
  }, [togglePlay, setStatus, isPlaying]);

  const handleMuteToggle = useCallback(() => {
    toggleMute();
  }, [toggleMute]);

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume);
    },
    [setVolume]
  );

  const handleFullscreenToggle = useCallback(() => {
    toggleFullscreen();
  }, [toggleFullscreen]);

  const exitFullscreen = useCallback(() => {
    if (isFullscreen) {
      setIsFullscreen(false);
    }
  }, [isFullscreen, setIsFullscreen]);

  return {
    // State
    status,
    isPlaying,
    isMuted,
    volume,
    isFullscreen,
    isLoading,
    error,

    // Event handlers for VideoPlayer
    handleLoad,
    handleBuffer,
    handleError,
    handleRetry,

    // Control handlers
    handlePlayPause,
    handleMuteToggle,
    handleVolumeChange,
    handleFullscreenToggle,
    exitFullscreen,
  };
}
