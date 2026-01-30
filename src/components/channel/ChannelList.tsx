import { View, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { Text } from "@components/ui/text";
import { ChannelGroup } from "./ChannelGroup";
import { SearchBar } from "./SearchBar";
import { useChannels } from "@hooks/useChannels";
import { useTranslation } from "react-i18next";
import { Tv, AlertTriangle, RefreshCw, Search } from "@utils/icons";
import type { Channel } from "@/types/channel";
import { useRouter } from "expo-router";

interface ChannelListProps {
  onChannelPress?: (channel: Channel) => void;
}

function EmptyState() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Tv size={48} className="text-muted-foreground mb-4" />
      <Text className="text-base font-medium text-center">
        {t("channel.empty")}
      </Text>
      <Text className="text-sm text-muted-foreground text-center mt-2">
        {t("channel.emptyHint")}
      </Text>
      <Pressable
        onPress={() => router.push("/settings")}
        className="mt-4 px-4 py-2 bg-muted rounded-lg active:opacity-70"
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
    <View className="flex-1 items-center justify-center px-4">
      <AlertTriangle size={48} className="text-destructive mb-4" />
      <Text className="text-base font-medium text-center">
        {t("channel.error")}
      </Text>
      <Text className="text-sm text-muted-foreground text-center mt-2">
        {t("channel.errorHint")}
      </Text>
      <Pressable
        onPress={onRetry}
        className="mt-4 flex-row items-center px-4 py-2 bg-muted rounded-lg active:opacity-70"
      >
        <RefreshCw size={16} className="text-foreground mr-2" />
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

export function ChannelList({ onChannelPress }: ChannelListProps) {
  const router = useRouter();
  const {
    groupedChannels,
    channels,
    allChannels,
    isLoading,
    isError,
    refetch,
  } = useChannels();

  const handleChannelPress = (channel: Channel) => {
    if (onChannelPress) {
      onChannelPress(channel);
    } else {
      // Default navigation to player
      router.push(`/player/${channel.id}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <SearchBar />
        <LoadingState />
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View className="flex-1 bg-background">
        <SearchBar />
        <ErrorState onRetry={() => refetch()} />
      </View>
    );
  }

  // Empty state (no sources or no channels)
  if (allChannels.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <SearchBar />
        <EmptyState />
      </View>
    );
  }

  // No search results
  if (channels.length === 0 && allChannels.length > 0) {
    return (
      <View className="flex-1 bg-background">
        <SearchBar />
        <NoResultsState />
      </View>
    );
  }

  // Normal state with channels
  return (
    <View className="flex-1 bg-background">
      <SearchBar />
      <ScrollView className="flex-1">
        {groupedChannels.map((group) => (
          <ChannelGroup
            key={group.name}
            group={group}
            onChannelPress={handleChannelPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}
