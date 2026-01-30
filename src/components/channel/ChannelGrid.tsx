import { View, Pressable, Image, ScrollView, useWindowDimensions } from "react-native";
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

function ChannelGridItem({ channel, onPress, width }: ChannelGridItemProps) {
  const statusMap = useChannelStore((state) => state.statusMap);
  const status: ChannelStatus = statusMap[channel.id] ?? "unknown";

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
}

interface ChannelGridProps {
  channels: Channel[];
  onChannelPress: (channel: Channel) => void;
}

export function ChannelGrid({ channels, onChannelPress }: ChannelGridProps) {
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = 3;
  const itemWidth = screenWidth / numColumns;

  return (
    <ScrollView className="flex-1">
      <View className="flex-row flex-wrap">
        {channels.map((channel) => (
          <ChannelGridItem
            key={channel.id}
            channel={channel}
            onPress={onChannelPress}
            width={itemWidth}
          />
        ))}
      </View>
    </ScrollView>
  );
}
