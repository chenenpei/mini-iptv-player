import { memo, useCallback } from "react";
import { View, Pressable, Image, useWindowDimensions, FlatList } from "react-native";
import type { Channel, ChannelStatus } from "@/types/channel";
import { Text } from "@components/ui/text";
import { StatusIndicator } from "./StatusIndicator";
import { Tv } from "@utils/icons";
import { useChannelStore } from "@stores/useChannelStore";
import { useChannelStatusCheck } from "@hooks/useChannelStatus";

interface ChannelGridItemProps {
  channel: Channel;
  onPress: (channel: Channel) => void;
  width: number;
}

const ChannelGridItem = memo(function ChannelGridItem({
  channel,
  onPress,
  width,
}: ChannelGridItemProps) {
  // Only subscribe to this channel's status, not the entire map
  const status = useChannelStore(
    (state) => state.statusMap[channel.id] ?? "unknown"
  ) as ChannelStatus;

  // Check status with rate-limited queue
  useChannelStatusCheck(channel);

  return (
    <Pressable
      onPress={() => onPress(channel)}
      style={{ width }}
      className="p-2"
    >
      <View className="bg-card rounded-xl p-3 items-center border border-border">
        {/* Logo */}
        <View className="h-16 w-16 rounded-lg bg-muted items-center justify-center overflow-hidden mb-2">
          {channel.logo ? (
            <Image
              source={{ uri: channel.logo }}
              className="h-full w-full"
              resizeMode="cover"
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
  const itemWidth = screenWidth / numColumns;

  const renderItem = useCallback(
    ({ item }: { item: Channel }) => (
      <ChannelGridItem
        channel={item}
        onPress={onChannelPress}
        width={itemWidth}
      />
    ),
    [onChannelPress, itemWidth]
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
    />
  );
}
