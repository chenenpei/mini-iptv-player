import { memo, useCallback, useMemo, useEffect } from "react";
import { View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
} from "@utils/icons";
import { useTranslation } from "react-i18next";

const ANIMATION_DURATION = 200;

interface ControlBarProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onVolumeChange: (volume: number) => void;
  onFullscreenToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
  visible?: boolean;
}

interface ControlButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityState?: { selected?: boolean; disabled?: boolean };
  disabled?: boolean;
  children: React.ReactNode;
}

const ControlButton = memo(function ControlButton({
  onPress,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  disabled = false,
  children,
}: ControlButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`h-11 w-11 items-center justify-center rounded-full active:bg-white/20 ${disabled ? "opacity-40" : ""}`}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
    >
      {children}
    </Pressable>
  );
});

const VolumeIcon = memo(function VolumeIcon({
  volume,
  isMuted,
}: {
  volume: number;
  isMuted: boolean;
}) {
  if (isMuted || volume === 0) {
    return <VolumeX size={24} className="text-white" />;
  }
  if (volume < 0.5) {
    return <Volume1 size={24} className="text-white" />;
  }
  return <Volume2 size={24} className="text-white" />;
});

export const ControlBar = memo(function ControlBar({
  isPlaying,
  isMuted,
  volume,
  isFullscreen,
  hasPrevious,
  hasNext,
  onPlayPause,
  onMuteToggle,
  onVolumeChange,
  onFullscreenToggle,
  onPrevious,
  onNext,
  visible = true,
}: ControlBarProps) {
  const { t } = useTranslation();
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: Easing.inOut(Easing.ease),
    });
  }, [visible, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    // Use threshold to handle animation floating point values
    pointerEvents: opacity.value < 0.1 ? "none" : "auto",
  }));

  const handlePlayPause = useCallback(() => {
    onPlayPause();
  }, [onPlayPause]);

  const handleMuteToggle = useCallback(() => {
    onMuteToggle();
  }, [onMuteToggle]);

  const handleVolumeChange = useCallback(
    (value: number) => {
      onVolumeChange(value);
    },
    [onVolumeChange]
  );

  const handleFullscreenToggle = useCallback(() => {
    onFullscreenToggle();
  }, [onFullscreenToggle]);

  const handlePrevious = useCallback(() => {
    onPrevious();
  }, [onPrevious]);

  const handleNext = useCallback(() => {
    onNext();
  }, [onNext]);

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

  return (
    <Animated.View
      style={animatedStyle}
      className="flex-row items-center justify-between px-2 py-2 bg-black/50"
    >
      {/* Left controls - Previous, Play/Pause, Next */}
      <View className="flex-row items-center">
        <ControlButton
          onPress={handlePrevious}
          accessibilityLabel={t("player.previous")}
          disabled={!hasPrevious}
          accessibilityState={{ disabled: !hasPrevious }}
        >
          <SkipBack size={24} className="text-white" />
        </ControlButton>

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

        <ControlButton
          onPress={handleNext}
          accessibilityLabel={t("player.next")}
          disabled={!hasNext}
          accessibilityState={{ disabled: !hasNext }}
        >
          <SkipForward size={24} className="text-white" />
        </ControlButton>
      </View>

      {/* Right controls - Volume, Fullscreen */}
      <View className="flex-row items-center">
        <ControlButton
          onPress={handleMuteToggle}
          accessibilityLabel={muteLabel}
          accessibilityState={{ selected: isMuted }}
        >
          <VolumeIcon volume={volume} isMuted={isMuted} />
        </ControlButton>

        <View className="w-24 mx-1">
          <Slider
            value={isMuted ? 0 : volume}
            onValueChange={handleVolumeChange}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#ffffff"
            accessibilityLabel={t("player.volume")}
            accessibilityValue={{
              min: 0,
              max: 100,
              now: Math.round(volume * 100),
            }}
          />
        </View>

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
    </Animated.View>
  );
});
