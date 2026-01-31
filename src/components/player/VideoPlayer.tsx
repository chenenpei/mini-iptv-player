import { memo, useCallback, useRef, useMemo, useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Video, {
  type VideoRef,
  type OnLoadData,
  type OnBufferData,
  type OnVideoErrorData,
} from "react-native-video";
import { LoadingOverlay } from "./LoadingOverlay";
import { ErrorOverlay } from "./ErrorOverlay";
import { ControlBar } from "./ControlBar";
import { useTranslation } from "react-i18next";

const CONTROLS_HIDE_DELAY = 4000; // 4 seconds

interface VideoPlayerProps {
  url: string;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  isLoading: boolean;
  error: string | null;
  hasPrevious: boolean;
  hasNext: boolean;
  onLoad: () => void;
  onBuffer: (buffering: boolean) => void;
  onError: (error: string) => void;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onVolumeChange: (volume: number) => void;
  onFullscreenToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRetry: () => void;
}

export const VideoPlayer = memo(function VideoPlayer({
  url,
  isPlaying,
  isMuted,
  volume,
  isFullscreen,
  isLoading,
  error,
  hasPrevious,
  hasNext,
  onLoad,
  onBuffer,
  onError,
  onPlayPause,
  onMuteToggle,
  onVolumeChange,
  onFullscreenToggle,
  onPrevious,
  onNext,
  onRetry,
}: VideoPlayerProps) {
  const { t } = useTranslation();
  const videoRef = useRef<VideoRef>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  // Start/reset auto-hide timer when controls become visible or playing state changes
  useEffect(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    // Only auto-hide when playing and controls are visible
    if (controlsVisible && isPlaying) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, CONTROLS_HIDE_DELAY);
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [controlsVisible, isPlaying]);

  const handleVideoPress = useCallback(() => {
    setControlsVisible((prev) => !prev);
  }, []);

  const handleLoad = useCallback(
    (_data: OnLoadData) => {
      onLoad();
    },
    [onLoad]
  );

  const handleBuffer = useCallback(
    (data: OnBufferData) => {
      onBuffer(data.isBuffering);
    },
    [onBuffer]
  );

  const handleError = useCallback(
    (data: OnVideoErrorData) => {
      const errorMessage = data.error?.errorString || "Unknown playback error";
      onError(errorMessage);
    },
    [onError]
  );

  // Reset timer when user interacts with controls
  const handleControlInteraction = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, CONTROLS_HIDE_DELAY);
    }
  }, [isPlaying]);

  // Wrap control handlers to reset timer
  const handlePlayPauseWithTimer = useCallback(() => {
    handleControlInteraction();
    onPlayPause();
  }, [handleControlInteraction, onPlayPause]);

  const handleMuteToggleWithTimer = useCallback(() => {
    handleControlInteraction();
    onMuteToggle();
  }, [handleControlInteraction, onMuteToggle]);

  const handleVolumeChangeWithTimer = useCallback(
    (newVolume: number) => {
      handleControlInteraction();
      onVolumeChange(newVolume);
    },
    [handleControlInteraction, onVolumeChange]
  );

  const handleFullscreenToggleWithTimer = useCallback(() => {
    handleControlInteraction();
    onFullscreenToggle();
  }, [handleControlInteraction, onFullscreenToggle]);

  const handlePreviousWithTimer = useCallback(() => {
    handleControlInteraction();
    onPrevious();
  }, [handleControlInteraction, onPrevious]);

  const handleNextWithTimer = useCallback(() => {
    handleControlInteraction();
    onNext();
  }, [handleControlInteraction, onNext]);

  const containerStyle = useMemo(
    () => [styles.container, isFullscreen && styles.fullscreen],
    [isFullscreen]
  );

  const hasError = error !== null;
  const showControls = controlsVisible && !hasError;

  return (
    <View style={containerStyle}>
      {/* Video with touch handler */}
      <Pressable
        className="flex-1 bg-black"
        onPress={handleVideoPress}
        accessibilityLabel={
          controlsVisible ? t("player.hideControls") : t("player.showControls")
        }
        accessibilityRole="button"
      >
        {!hasError && url && (
          <Video
            ref={videoRef}
            source={{ uri: url }}
            style={styles.video}
            paused={!isPlaying}
            muted={isMuted}
            volume={volume}
            resizeMode="contain"
            onLoad={handleLoad}
            onBuffer={handleBuffer}
            onError={handleError}
            repeat={false}
            playInBackground={false}
            playWhenInactive={false}
          />
        )}

        {/* Loading Overlay */}
        <LoadingOverlay visible={isLoading && !hasError} />

        {/* Error Overlay */}
        <ErrorOverlay visible={hasError} message={error} onRetry={onRetry} />
      </Pressable>

      {/* Control Bar */}
      <ControlBar
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        isFullscreen={isFullscreen}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPlayPause={handlePlayPauseWithTimer}
        onMuteToggle={handleMuteToggleWithTimer}
        onVolumeChange={handleVolumeChangeWithTimer}
        onFullscreenToggle={handleFullscreenToggleWithTimer}
        onPrevious={handlePreviousWithTimer}
        onNext={handleNextWithTimer}
        visible={showControls}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  fullscreen: {
    flex: 1,
    aspectRatio: undefined,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
});
