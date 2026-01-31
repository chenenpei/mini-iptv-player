import { memo, useCallback, useMemo } from "react";
import { View, Pressable } from "react-native";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "@utils/icons";
import { useTranslation } from "react-i18next";

interface ControlBarProps {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  visible?: boolean;
}

interface ControlButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityState?: { selected?: boolean };
  children: React.ReactNode;
}

const ControlButton = memo(function ControlButton({
  onPress,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  children,
}: ControlButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-full active:bg-white/20"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
    >
      {children}
    </Pressable>
  );
});

export const ControlBar = memo(function ControlBar({
  isPlaying,
  isMuted,
  isFullscreen,
  onPlayPause,
  onMuteToggle,
  onFullscreenToggle,
  visible = true,
}: ControlBarProps) {
  const { t } = useTranslation();

  const handlePlayPause = useCallback(() => {
    onPlayPause();
  }, [onPlayPause]);

  const handleMuteToggle = useCallback(() => {
    onMuteToggle();
  }, [onMuteToggle]);

  const handleFullscreenToggle = useCallback(() => {
    onFullscreenToggle();
  }, [onFullscreenToggle]);

  const playPauseLabel = useMemo(
    () => (isPlaying ? t("player.pause") : t("player.play")),
    [isPlaying, t]
  );

  const muteLabel = useMemo(
    () => (isMuted ? t("player.unmute") : t("player.mute")),
    [isMuted, t]
  );

  const fullscreenLabel = useMemo(
    () => (isFullscreen ? t("player.exitFullscreen") : t("player.fullscreen")),
    [isFullscreen, t]
  );

  if (!visible) return null;

  return (
    <View className="flex-row items-center justify-between px-4 py-2 bg-black/50">
      {/* Left controls - Play/Pause */}
      <View className="flex-row items-center">
        <ControlButton
          onPress={handlePlayPause}
          accessibilityLabel={playPauseLabel}
          accessibilityState={{ selected: isPlaying }}
        >
          {isPlaying ? (
            <Pause size={24} className="text-white" />
          ) : (
            <Play size={24} className="text-white" />
          )}
        </ControlButton>
      </View>

      {/* Right controls - Mute, Fullscreen */}
      <View className="flex-row items-center">
        <ControlButton
          onPress={handleMuteToggle}
          accessibilityLabel={muteLabel}
          accessibilityState={{ selected: isMuted }}
        >
          {isMuted ? (
            <VolumeX size={24} className="text-white" />
          ) : (
            <Volume2 size={24} className="text-white" />
          )}
        </ControlButton>

        <ControlButton
          onPress={handleFullscreenToggle}
          accessibilityLabel={fullscreenLabel}
          accessibilityState={{ selected: isFullscreen }}
        >
          {isFullscreen ? (
            <Minimize size={24} className="text-white" />
          ) : (
            <Maximize size={24} className="text-white" />
          )}
        </ControlButton>
      </View>
    </View>
  );
});
