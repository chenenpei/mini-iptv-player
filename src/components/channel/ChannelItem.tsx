import { memo, useCallback, useState } from "react";
import { View, Pressable } from "react-native";
import { Image } from "expo-image";
import type { Channel, ChannelStatus } from "@/types/channel";
import { Text } from "@components/ui/text";
import { StatusIndicator } from "./StatusIndicator";
import { Tv } from "@utils/icons";
import { useChannelStore } from "@stores/useChannelStore";
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

  // Check status with rate-limited queue
  useChannelStatusCheck(channel);

  const statusLabel = t(statusTranslationKeys[status]);

  const handlePress = useCallback(() => {
    onPress(channel);
  }, [onPress, channel]);

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
      {/* Logo */}
      <View className="h-12 w-12 rounded-xl bg-muted items-center justify-center overflow-hidden">
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

      {/* Status Indicator */}
      <StatusIndicator status={status} />
    </Pressable>
  );
});
