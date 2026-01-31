import { memo, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { View, Pressable, FlatList, BackHandler } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@components/ui/text";
import { VideoPlayer } from "@components/player";
import { ChannelItem } from "@components/channel/ChannelItem";
import { useChannelById, useChannels } from "@hooks/useChannels";
import { usePlayer } from "@hooks/usePlayer";
import { useHistoryStore } from "@stores/useHistoryStore";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Tv } from "@utils/icons";
import type { Channel } from "@/types/channel";
import { StatusBar } from "expo-status-bar";

// Channel not found state
function ChannelNotFound() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <Tv size={64} className="text-muted-foreground mb-4" />
      <Text className="text-lg font-medium text-center">
        {t("player.noChannel")}
      </Text>
      <Pressable
        onPress={() => router.back()}
        className="mt-4 px-6 py-3 bg-primary rounded-lg active:opacity-70 min-h-11"
        accessibilityLabel={t("player.goBack")}
        accessibilityRole="button"
      >
        <Text className="text-primary-foreground font-medium">
          {t("player.goBack")}
        </Text>
      </Pressable>
    </View>
  );
}

// Mini channel list for player page
interface PlayerChannelListProps {
  currentChannelId: string;
  onChannelPress: (channel: Channel) => void;
}

const PlayerChannelList = memo(function PlayerChannelList({
  currentChannelId,
  onChannelPress,
}: PlayerChannelListProps) {
  const { channels } = useChannels();

  const renderItem = useCallback(
    ({ item }: { item: Channel }) => (
      <View
        className={item.id === currentChannelId ? "bg-primary/10" : undefined}
      >
        <ChannelItem channel={item} onPress={onChannelPress} />
      </View>
    ),
    [currentChannelId, onChannelPress]
  );

  const keyExtractor = useCallback((item: Channel) => item.id, []);

  return (
    <FlatList
      data={channels}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      className="flex-1"
    />
  );
});

export default function PlayerScreen() {
  const { channelId: initialChannelId } = useLocalSearchParams<{ channelId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { channels } = useChannels();

  // Use local state for current channel to avoid page navigation on switch
  const [currentChannelId, setCurrentChannelId] = useState(initialChannelId || "");
  const channel = useChannelById(currentChannelId);

  // History tracking
  const addHistory = useHistoryStore((state) => state.addHistory);
  const historyRecordedRef = useRef<string | null>(null);

  const {
    isPlaying,
    isMuted,
    volume,
    isFullscreen,
    isLoading,
    error,
    handleLoad,
    handleBuffer,
    handleError,
    handleRetry,
    handlePlayPause,
    handleMuteToggle,
    handleVolumeChange,
    handleFullscreenToggle,
    exitFullscreen,
  } = usePlayer(currentChannelId, channel?.url || "");

  // Find current channel index for prev/next navigation
  const currentIndex = useMemo(
    () => channels.findIndex((c) => c.id === currentChannelId),
    [channels, currentChannelId]
  );
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < channels.length - 1;

  // Handle back button to exit fullscreen first
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isFullscreen) {
          exitFullscreen();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isFullscreen, exitFullscreen]);

  // Record history when channel is played
  useEffect(() => {
    if (channel && historyRecordedRef.current !== channel.id) {
      addHistory(channel);
      historyRecordedRef.current = channel.id;
    }
  }, [channel, addHistory]);

  const handleChannelPress = useCallback(
    (newChannel: Channel) => {
      if (newChannel.id !== currentChannelId) {
        setCurrentChannelId(newChannel.id);
      }
    },
    [currentChannelId]
  );

  const handlePrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentChannelId(channels[currentIndex - 1].id);
    }
  }, [hasPrevious, channels, currentIndex]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setCurrentChannelId(channels[currentIndex + 1].id);
    }
  }, [hasNext, channels, currentIndex]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // Header title
  const headerTitle = useMemo(
    () => channel?.name || t("player.noChannel"),
    [channel?.name, t]
  );

  // Channel not found
  if (!channel) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            title: t("player.noChannel"),
            headerLeft: () => (
              <Pressable
                onPress={handleGoBack}
                className="p-2 -ml-2 min-h-11 min-w-11 items-center justify-center"
                accessibilityLabel={t("player.goBack")}
                accessibilityRole="button"
              >
                <ArrowLeft size={24} className="text-foreground" />
              </Pressable>
            ),
          }}
        />
        <ChannelNotFound />
      </>
    );
  }

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <>
        <StatusBar hidden />
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 bg-black">
          <VideoPlayer
            url={channel.url}
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            isFullscreen={isFullscreen}
            isLoading={isLoading}
            error={error}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onLoad={handleLoad}
            onBuffer={handleBuffer}
            onError={handleError}
            onPlayPause={handlePlayPause}
            onMuteToggle={handleMuteToggle}
            onVolumeChange={handleVolumeChange}
            onFullscreenToggle={handleFullscreenToggle}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onRetry={handleRetry}
          />
        </View>
      </>
    );
  }

  // Normal mode with split layout
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: headerTitle,
          headerLeft: () => (
            <Pressable
              onPress={handleGoBack}
              className="p-2 -ml-2 min-h-11 min-w-11 items-center justify-center"
              accessibilityLabel={t("player.goBack")}
              accessibilityRole="button"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </Pressable>
          ),
        }}
      />
      <View className="flex-1 bg-background">
        {/* Video Player */}
        <VideoPlayer
          url={channel.url}
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          isFullscreen={isFullscreen}
          isLoading={isLoading}
          error={error}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onLoad={handleLoad}
          onBuffer={handleBuffer}
          onError={handleError}
          onPlayPause={handlePlayPause}
          onMuteToggle={handleMuteToggle}
          onVolumeChange={handleVolumeChange}
          onFullscreenToggle={handleFullscreenToggle}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onRetry={handleRetry}
        />

        {/* Channel List */}
        <PlayerChannelList
          currentChannelId={currentChannelId}
          onChannelPress={handleChannelPress}
        />
      </View>
    </>
  );
}
