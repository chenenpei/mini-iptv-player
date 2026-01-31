import { memo, useCallback, useMemo } from "react";
import { View, ActivityIndicator, Pressable, SectionList } from "react-native";
import { Text } from "@components/ui/text";
import { ChannelItem } from "./ChannelItem";
import { ChannelGrid } from "./ChannelGrid";
import { SearchBar } from "./SearchBar";
import { Toolbar } from "./Toolbar";
import { useChannels } from "@hooks/useChannels";
import { useChannelStore } from "@stores/useChannelStore";
import { useTranslation } from "react-i18next";
import { Tv, AlertTriangle, RefreshCw, Search, ChevronDown, ChevronRight } from "@utils/icons";
import type { Channel } from "@/types/channel";
import { useRouter } from "expo-router";

// SectionList data type
interface ChannelSection {
  title: string;
  data: Channel[];
  channelCount: number; // Total count for display (even when collapsed)
}

interface ChannelListProps {
  onChannelPress?: (channel: Channel) => void;
}

function EmptyState() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-4" accessibilityRole="alert">
      <Tv size={48} className="text-muted-foreground mb-4" />
      <Text className="text-base font-medium text-center">
        {t("channel.empty")}
      </Text>
      <Text className="text-sm text-muted-foreground text-center mt-2">
        {t("channel.emptyHint")}
      </Text>
      <Pressable
        onPress={() => router.push("/settings")}
        className="mt-4 px-4 py-2 bg-muted rounded-lg active:opacity-70 min-h-11"
        accessibilityLabel={t("channel.goToSettings")}
        accessibilityRole="button"
      >
        <Text>{t("channel.goToSettings")}</Text>
      </Pressable>
    </View>
  );
}

function LoadingState() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" className="mb-4" />
      <Text className="text-sm text-muted-foreground">
        {t("channel.loading")}
      </Text>
    </View>
  );
}

interface ErrorStateProps {
  onRetry: () => void;
}

function ErrorState({ onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-4" accessibilityRole="alert">
      <AlertTriangle size={48} className="text-destructive mb-4" />
      <Text className="text-base font-medium text-center">
        {t("channel.error")}
      </Text>
      <Text className="text-sm text-muted-foreground text-center mt-2">
        {t("channel.errorHint")}
      </Text>
      <Pressable
        onPress={onRetry}
        className="mt-4 flex-row items-center px-4 py-2 bg-muted rounded-lg active:opacity-70 min-h-11"
        accessibilityLabel={t("common.retry")}
        accessibilityRole="button"
      >
        <RefreshCw size={24} className="text-foreground mr-2" />
        <Text>{t("common.retry")}</Text>
      </Pressable>
    </View>
  );
}

function NoResultsState() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Search size={48} className="text-muted-foreground mb-4" />
      <Text className="text-base font-medium text-center">
        {t("channel.noResults")}
      </Text>
      <Text className="text-sm text-muted-foreground text-center mt-2">
        {t("channel.noResultsHint")}
      </Text>
    </View>
  );
}

// Section header component for SectionList
interface SectionHeaderProps {
  section: ChannelSection;
}

const SectionHeader = memo(function SectionHeader({
  section,
}: SectionHeaderProps) {
  const { t } = useTranslation();
  const isCollapsed = useChannelStore((state) =>
    state.collapsedGroups.has(section.title)
  );
  const toggleGroupCollapsed = useChannelStore(
    (state) => state.toggleGroupCollapsed
  );

  const groupLabel = t("channel.groupLabel", { name: section.title, count: section.channelCount });
  const stateLabel = isCollapsed ? t("channel.groupCollapsed") : t("channel.groupExpanded");

  return (
    <Pressable
      onPress={() => toggleGroupCollapsed(section.title)}
      className="flex-row items-center justify-between px-4 py-3 bg-muted/30 active:bg-muted/50 border-b border-border"
      accessibilityLabel={`${groupLabel}, ${stateLabel}`}
      accessibilityRole="button"
      accessibilityState={{ expanded: !isCollapsed }}
      accessibilityHint={t("channel.toggleGroupHint")}
    >
      <View className="flex-row items-center">
        {isCollapsed ? (
          <ChevronRight size={24} className="text-muted-foreground mr-2" />
        ) : (
          <ChevronDown size={24} className="text-muted-foreground mr-2" />
        )}
        <Text className="text-base font-semibold">{section.title}</Text>
      </View>
      <Text className="text-sm text-muted-foreground">({section.channelCount})</Text>
    </Pressable>
  );
});

export function ChannelList({ onChannelPress }: ChannelListProps) {
  const router = useRouter();
  const layoutMode = useChannelStore((state) => state.layoutMode);
  const collapsedGroups = useChannelStore((state) => state.collapsedGroups);
  const {
    groupedChannels,
    channels,
    allChannels,
    isLoading,
    isError,
    refetch,
  } = useChannels();

  const handleChannelPress = useCallback(
    (channel: Channel) => {
      if (onChannelPress) {
        onChannelPress(channel);
      } else {
        router.push({
          pathname: "/player/[channelId]",
          params: { channelId: channel.id },
        });
      }
    },
    [onChannelPress, router]
  );

  // Convert grouped channels to SectionList format with collapse support
  const sections: ChannelSection[] = useMemo(() => {
    return groupedChannels.map((group) => ({
      title: group.name,
      // Empty data array when collapsed - SectionList won't render items
      data: collapsedGroups.has(group.name) ? [] : group.channels,
      channelCount: group.channels.length,
    }));
  }, [groupedChannels, collapsedGroups]);

  const renderItem = useCallback(
    ({ item }: { item: Channel }) => (
      <ChannelItem channel={item} onPress={handleChannelPress} />
    ),
    [handleChannelPress]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: ChannelSection }) => (
      <SectionHeader section={section} />
    ),
    []
  );

  const keyExtractor = useCallback((item: Channel) => item.id, []);

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <SearchBar />
        <Toolbar />
        <LoadingState />
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View className="flex-1 bg-background">
        <SearchBar />
        <Toolbar />
        <ErrorState onRetry={() => refetch()} />
      </View>
    );
  }

  // Empty state (no sources or no channels)
  if (allChannels.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <SearchBar />
        <Toolbar />
        <EmptyState />
      </View>
    );
  }

  // No search results
  if (channels.length === 0 && allChannels.length > 0) {
    return (
      <View className="flex-1 bg-background">
        <SearchBar />
        <Toolbar />
        <NoResultsState />
      </View>
    );
  }

  // Normal state with channels
  return (
    <View className="flex-1 bg-background">
      <SearchBar />
      <Toolbar />
      {layoutMode === "grid" ? (
        <ChannelGrid channels={channels} onChannelPress={handleChannelPress} />
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={keyExtractor}
          stickySectionHeadersEnabled={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={15}
          windowSize={5}
          initialNumToRender={20}
          getItemLayout={(_, index) => ({
            length: 64, // Approximate height of ChannelItem
            offset: 64 * index,
            index,
          })}
        />
      )}
    </View>
  );
}
