import { memo, useCallback, useRef, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Video, {
  type VideoRef,
  type OnLoadData,
  type OnBufferData,
  type OnVideoErrorData,
} from "react-native-video";
import { LoadingOverlay } from "./LoadingOverlay";
import { ErrorOverlay } from "./ErrorOverlay";
import { ControlBar } from "./ControlBar";

interface VideoPlayerProps {
  url: string;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isLoading: boolean;
  error: string | null;
  onLoad: () => void;
  onBuffer: (buffering: boolean) => void;
  onError: (error: string) => void;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onRetry: () => void;
}

export const VideoPlayer = memo(function VideoPlayer({
  url,
  isPlaying,
  isMuted,
  isFullscreen,
  isLoading,
  error,
  onLoad,
  onBuffer,
  onError,
  onPlayPause,
  onMuteToggle,
  onFullscreenToggle,
  onRetry,
}: VideoPlayerProps) {
  const videoRef = useRef<VideoRef>(null);

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

  const containerStyle = useMemo(
    () => [styles.container, isFullscreen && styles.fullscreen],
    [isFullscreen]
  );

  const hasError = error !== null;

  return (
    <View style={containerStyle}>
      {/* Video */}
      <View className="flex-1 bg-black">
        {!hasError && url && (
          <Video
            ref={videoRef}
            source={{ uri: url }}
            style={styles.video}
            paused={!isPlaying}
            muted={isMuted}
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
      </View>

      {/* Control Bar */}
      <ControlBar
        isPlaying={isPlaying}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        onPlayPause={onPlayPause}
        onMuteToggle={onMuteToggle}
        onFullscreenToggle={onFullscreenToggle}
        visible={!hasError}
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
