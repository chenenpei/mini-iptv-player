import type { Channel, ChannelStatus } from "@/types/channel";
import { Text } from "@components/ui/text";
import { useChannelStatusCheck } from "@hooks/useChannelStatus";
import { useChannelStore } from "@stores/useChannelStore";
import { useFavoriteStore } from "@stores/useFavoriteStore";
import { Tv, Star } from "@utils/icons";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import { StatusIndicator } from "./StatusIndicator";

interface ChannelGridItemProps {
  channel: Channel;
  onPress: (channel: Channel) => void;
  width: number;
}

const statusTranslationKeys: Record<ChannelStatus, string> = {
  available: "channel.statusAvailable",
  unavailable: "channel.statusUnavailable",
  unknown: "channel.statusUnknown",
};

const ChannelGridItem = memo(function ChannelGridItem({
  channel,
  onPress,
  width,
}: ChannelGridItemProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  // Only subscribe to this channel's status, not the entire map
  const status = useChannelStore(
    (state) => state.statusMap[channel.id] ?? "unknown",
  ) as ChannelStatus;

  // Favorite state
  const isFavorite = useFavoriteStore(
    (state) => state.favorites.some((c) => c.id === channel.id)
  );
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  // Check status with rate-limited queue
  useChannelStatusCheck(channel);

  const statusLabel = t(statusTranslationKeys[status]);
  const favoriteLabel = isFavorite
    ? t("channel.removeFavorite")
    : t("channel.addFavorite");

  const handlePress = useCallback(() => {
    onPress(channel);
  }, [onPress, channel]);

  const handleFavoritePress = useCallback(() => {
    toggleFavorite(channel);
  }, [toggleFavorite, channel]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const containerStyle = useMemo(() => ({ width }), [width]);
  const showLogo = channel.logo && !imageError;

  return (
    <Pressable
      onPress={handlePress}
      style={containerStyle}
      className="p-2 active:opacity-90"
      accessibilityLabel={`${channel.name}, ${statusLabel}`}
      accessibilityRole="button"
      accessibilityHint={t("channel.playHint")}
    >
      <View className="bg-card rounded-xl p-3 items-center border border-border relative">
        {/* Status Indicator - Top Left */}
        <View className="absolute top-2 left-2 z-10">
          <StatusIndicator status={status} />
        </View>

        {/* Logo */}
        <View className="h-16 w-16 rounded-xl bg-muted items-center justify-center overflow-hidden mb-2">
          {showLogo ? (
            <Image
              source={{ uri: channel.logo }}
              className="h-14 w-14"
              contentFit="contain"
              transition={150}
              cachePolicy="memory-disk"
              accessibilityIgnoresInvertColors
              onError={handleImageError}
            />
          ) : (
            <Tv size={32} className="text-muted-foreground" />
          )}
        </View>

        {/* Channel Name */}
        <Text className="text-sm font-medium text-center" numberOfLines={1}>
          {channel.name}
        </Text>

        {/* Favorite Button - Below Name */}
        <Pressable
          onPress={handleFavoritePress}
          className="mt-1 p-1.5 min-h-8 min-w-8 items-center justify-center active:opacity-70"
          accessibilityLabel={favoriteLabel}
          accessibilityRole="button"
          accessibilityState={{ selected: isFavorite }}
        >
          {isFavorite ? (
            <Star size={18} fill="#eab308" className="text-yellow-500" />
          ) : (
            <Star size={18} className="text-muted-foreground" />
          )}
        </Pressable>
      </View>
    </Pressable>
  );
});

interface ChannelGridProps {
  channels: Channel[];
  onChannelPress: (channel: Channel) => void;
}

export function ChannelGrid({ channels, onChannelPress }: ChannelGridProps) {
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = 3;
  const horizontalPadding = 8,
    verticalPadding = 8; // px-2 on container
  const itemWidth = (screenWidth - horizontalPadding * 2) / numColumns;

  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: horizontalPadding,
      paddingVertical: verticalPadding,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: Channel }) => (
      <ChannelGridItem
        channel={item}
        onPress={onChannelPress}
        width={itemWidth}
      />
    ),
    [onChannelPress, itemWidth],
  );

  const keyExtractor = useCallback((item: Channel) => item.id, []);

  return (
    <FlatList
      data={channels}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      removeClippedSubviews={true}
      maxToRenderPerBatch={12}
      windowSize={5}
      contentContainerStyle={contentContainerStyle}
    />
  );
}
