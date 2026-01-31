import { memo, useCallback, useState } from "react";
import { View, Pressable } from "react-native";
import { Image } from "expo-image";
import type { Channel, ChannelStatus } from "@/types/channel";
import { Text } from "@components/ui/text";
import { StatusIndicator } from "./StatusIndicator";
import { Tv, Star } from "@utils/icons";
import { useChannelStore } from "@stores/useChannelStore";
import { useFavoriteStore } from "@stores/useFavoriteStore";
import { useChannelStatusCheck } from "@hooks/useChannelStatus";
import { useTranslation } from "react-i18next";

interface ChannelItemProps {
  channel: Channel;
  onPress: (channel: Channel) => void;
}

const statusTranslationKeys: Record<ChannelStatus, string> = {
  available: "channel.statusAvailable",
  unavailable: "channel.statusUnavailable",
  unknown: "channel.statusUnknown",
};

export const ChannelItem = memo(function ChannelItem({ channel, onPress }: ChannelItemProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  // Only subscribe to this channel's status, not the entire map
  const status = useChannelStore(
    (state) => state.statusMap[channel.id] ?? "unknown"
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

  const showLogo = channel.logo && !imageError;

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center px-4 py-3 active:bg-muted/50"
      accessibilityLabel={`${channel.name}, ${statusLabel}`}
      accessibilityRole="button"
      accessibilityHint={t("channel.playHint")}
    >
      {/* Status Indicator */}
      <StatusIndicator status={status} />

      {/* Logo */}
      <View className="h-12 w-12 rounded-xl bg-muted items-center justify-center overflow-hidden ml-3">
        {showLogo ? (
          <Image
            source={{ uri: channel.logo }}
            className="h-10 w-10"
            contentFit="contain"
            transition={150}
            cachePolicy="memory-disk"
            accessibilityIgnoresInvertColors
            onError={handleImageError}
          />
        ) : (
          <Tv size={24} className="text-muted-foreground" />
        )}
      </View>

      {/* Channel Info */}
      <View className="flex-1 ml-3">
        <Text className="text-base font-medium" numberOfLines={1}>
          {channel.name}
        </Text>
        {channel.tvgName && channel.tvgName !== channel.name && (
          <Text className="text-sm text-muted-foreground" numberOfLines={1}>
            {channel.tvgName}
          </Text>
        )}
      </View>

      {/* Favorite Button */}
      <Pressable
        onPress={handleFavoritePress}
        className="p-2 min-h-11 min-w-11 items-center justify-center active:opacity-70"
        accessibilityLabel={favoriteLabel}
        accessibilityRole="button"
        accessibilityState={{ selected: isFavorite }}
      >
        {isFavorite ? (
          <Star size={20} fill="#eab308" className="text-yellow-500" />
        ) : (
          <Star size={20} className="text-muted-foreground" />
        )}
      </Pressable>
    </Pressable>
  );
});
