import { memo, useCallback, useMemo } from "react";
import { View, Pressable, FlatList, BackHandler } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@components/ui/text";
import { VideoPlayer } from "@components/player";
import { ChannelItem } from "@components/channel/ChannelItem";
import { useChannelById, useChannels } from "@hooks/useChannels";
import { usePlayer } from "@hooks/usePlayer";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Tv } from "@utils/icons";
import type { Channel } from "@/types/channel";
import { useEffect } from "react";
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
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const channel = useChannelById(channelId || "");

  const {
    isPlaying,
    isMuted,
    isFullscreen,
    isLoading,
    error,
    handleLoad,
    handleBuffer,
    handleError,
    handleRetry,
    handlePlayPause,
    handleMuteToggle,
    handleFullscreenToggle,
    exitFullscreen,
  } = usePlayer(channelId || "", channel?.url || "");

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

  const handleChannelPress = useCallback(
    (newChannel: Channel) => {
      if (newChannel.id !== channelId) {
        router.replace({
          pathname: "/player/[channelId]",
          params: { channelId: newChannel.id },
        });
      }
    },
    [channelId, router]
  );

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
            isFullscreen={isFullscreen}
            isLoading={isLoading}
            error={error}
            onLoad={handleLoad}
            onBuffer={handleBuffer}
            onError={handleError}
            onPlayPause={handlePlayPause}
            onMuteToggle={handleMuteToggle}
            onFullscreenToggle={handleFullscreenToggle}
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
          isFullscreen={isFullscreen}
          isLoading={isLoading}
          error={error}
          onLoad={handleLoad}
          onBuffer={handleBuffer}
          onError={handleError}
          onPlayPause={handlePlayPause}
          onMuteToggle={handleMuteToggle}
          onFullscreenToggle={handleFullscreenToggle}
          onRetry={handleRetry}
        />

        {/* Channel List */}
        <PlayerChannelList
          currentChannelId={channelId || ""}
          onChannelPress={handleChannelPress}
        />
      </View>
    </>
  );
}
