import type { Channel, ChannelStatus } from "@/types/channel";
import { Text } from "@components/ui/text";
import { useChannelStatusCheck } from "@hooks/useChannelStatus";
import { useChannelStore } from "@stores/useChannelStore";
import { Tv } from "@utils/icons";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
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
  // Only subscribe to this channel's status, not the entire map
  const status = useChannelStore(
    (state) => state.statusMap[channel.id] ?? "unknown",
  ) as ChannelStatus;

  // Check status with rate-limited queue
  useChannelStatusCheck(channel);

  const statusLabel = t(statusTranslationKeys[status]);

  return (
    <Pressable
      onPress={() => onPress(channel)}
      style={{ width }}
      className="p-2 active:opacity-90"
      accessibilityLabel={`${channel.name}, ${statusLabel}`}
      accessibilityRole="button"
      accessibilityHint={t("channel.playHint")}
    >
      <View className="bg-card rounded-xl p-3 items-center border border-border">
        {/* Logo */}
        <View className="h-16 w-16 rounded-xl bg-muted items-center justify-center overflow-hidden mb-2">
          {channel.logo ? (
            <Image
              source={{ uri: channel.logo }}
              className="h-14 w-14"
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Tv size={32} className="text-muted-foreground" />
          )}
        </View>

        {/* Channel Name */}
        <Text className="text-sm font-medium text-center" numberOfLines={1}>
          {channel.name}
        </Text>

        {/* Status Indicator */}
        <View className="mt-2">
          <StatusIndicator status={status} />
        </View>
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
      contentContainerStyle={{
        paddingHorizontal: horizontalPadding,
        paddingVertical: verticalPadding,
      }}
    />
  );
}
