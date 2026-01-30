import { View, Pressable, Image } from "react-native";
import type { Channel, ChannelStatus } from "@/types/channel";
import { Text } from "@components/ui/text";
import { StatusIndicator } from "./StatusIndicator";
import { Tv } from "@utils/icons";
import { useChannelStore } from "@stores/useChannelStore";
import { useChannelStatusCheck } from "@hooks/useChannelStatus";

interface ChannelItemProps {
  channel: Channel;
  onPress: (channel: Channel) => void;
}

export function ChannelItem({ channel, onPress }: ChannelItemProps) {
  const statusMap = useChannelStore((state) => state.statusMap);
  const status: ChannelStatus = statusMap[channel.id] ?? "unknown";

  // Trigger status check when item becomes visible
  useChannelStatusCheck(channel);

  return (
    <Pressable
      onPress={() => onPress(channel)}
      className="flex-row items-center px-4 py-3 active:bg-muted/50"
    >
      {/* Logo */}
      <View className="h-12 w-12 rounded-lg bg-muted items-center justify-center overflow-hidden">
        {channel.logo ? (
          <Image
            source={{ uri: channel.logo }}
            className="h-full w-full"
            resizeMode="cover"
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
}
