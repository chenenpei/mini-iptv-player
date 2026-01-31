import { useCallback } from "react";
import { View, Pressable } from "react-native";
import type { ChannelGroup as ChannelGroupType } from "@/types/channel";
import { Text } from "@components/ui/text";
import { ChannelItem } from "./ChannelItem";
import { ChevronDown, ChevronRight } from "@utils/icons";
import { useChannelStore } from "@stores/useChannelStore";
import type { Channel } from "@/types/channel";
import { useTranslation } from "react-i18next";

interface ChannelGroupProps {
  group: ChannelGroupType;
  onChannelPress: (channel: Channel) => void;
}

export function ChannelGroup({ group, onChannelPress }: ChannelGroupProps) {
  const { t } = useTranslation();
  const isCollapsed = useChannelStore((state) =>
    state.collapsedGroups.has(group.name)
  );
  const toggleGroupCollapsed = useChannelStore(
    (state) => state.toggleGroupCollapsed
  );

  const handleToggle = useCallback(() => {
    toggleGroupCollapsed(group.name);
  }, [toggleGroupCollapsed, group.name]);

  return (
    <View className="border-b border-border">
      {/* Group Header */}
      <Pressable
        onPress={handleToggle}
        className="flex-row items-center justify-between px-4 py-3 bg-muted/30 active:bg-muted/50"
        accessibilityLabel={t("channel.groupLabel", {
          name: group.name,
          count: group.channels.length,
        })}
        accessibilityRole="button"
        accessibilityState={{ expanded: !isCollapsed }}
        accessibilityHint={
          isCollapsed ? t("channel.expandHint") : t("channel.collapseHint")
        }
      >
        <View className="flex-row items-center">
          {isCollapsed ? (
            <ChevronRight size={20} className="text-muted-foreground mr-2" />
          ) : (
            <ChevronDown size={20} className="text-muted-foreground mr-2" />
          )}
          <Text className="text-base font-semibold">{group.name}</Text>
        </View>
        <Text className="text-sm text-muted-foreground">
          ({group.channels.length})
        </Text>
      </Pressable>

      {/* Channel List */}
      {!isCollapsed && (
        <View>
          {group.channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              onPress={onChannelPress}
            />
          ))}
        </View>
      )}
    </View>
  );
}
