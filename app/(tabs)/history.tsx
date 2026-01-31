import { useState, useCallback, useMemo } from "react";
import { View, Pressable, SectionList } from "react-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChannelItem } from "@/components/channel/ChannelItem";
import { useHistoryStore, type HistoryRecord } from "@/stores/useHistoryStore";
import { useTranslation } from "react-i18next";
import { Clock, Search, X, Trash2, ChevronDown } from "@/utils/icons";
import { useRouter } from "expo-router";
import type { Channel } from "@/types/channel";

type SortBy = "time" | "name";

function EmptyState() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Clock size={48} className="text-muted-foreground mb-4" />
      <Text className="text-base font-medium text-center">
        {t("history.empty")}
      </Text>
      <Text className="text-sm text-muted-foreground text-center mt-2">
        {t("history.emptyHint")}
      </Text>
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

interface HistorySection {
  title: string;
  data: HistoryRecord[];
}

function formatRelativeTime(timestamp: number, t: ReturnType<typeof useTranslation>["t"]): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) {
    return t("history.justNow");
  }
  if (minutes < 60) {
    return t("history.minutesAgo", { count: minutes });
  }
  if (hours < 24) {
    return t("history.hoursAgo", { count: hours });
  }

  // Return time for older records
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function isToday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isYesterday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export default function HistoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("time");

  const history = useHistoryStore((state) => state.history);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: "time", label: t("history.sortByTime") },
    { value: "name", label: t("channel.sortByName") },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label ?? "";

  const handleSortPress = () => {
    const currentIndex = sortOptions.findIndex((opt) => opt.value === sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex].value);
  };

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) {
      return history;
    }
    const query = searchQuery.toLowerCase();
    return history.filter(
      (record) =>
        record.channel.name.toLowerCase().includes(query) ||
        record.channel.tvgName?.toLowerCase().includes(query)
    );
  }, [history, searchQuery]);

  const sections = useMemo<HistorySection[]>(() => {
    // Sort by name: single section with alphabetically sorted items
    if (sortBy === "name") {
      const sorted = [...filteredHistory].sort((a, b) =>
        a.channel.name.localeCompare(b.channel.name)
      );
      if (sorted.length === 0) return [];
      return [{ title: t("channel.sortByName"), data: sorted }];
    }

    // Sort by time: group by date
    const todayRecords: HistoryRecord[] = [];
    const yesterdayRecords: HistoryRecord[] = [];
    const olderRecords: Map<string, HistoryRecord[]> = new Map();

    for (const record of filteredHistory) {
      if (isToday(record.watchedAt)) {
        todayRecords.push(record);
      } else if (isYesterday(record.watchedAt)) {
        yesterdayRecords.push(record);
      } else {
        const dateKey = formatDate(record.watchedAt);
        if (!olderRecords.has(dateKey)) {
          olderRecords.set(dateKey, []);
        }
        olderRecords.get(dateKey)!.push(record);
      }
    }

    const result: HistorySection[] = [];

    if (todayRecords.length > 0) {
      result.push({ title: t("history.today"), data: todayRecords });
    }
    if (yesterdayRecords.length > 0) {
      result.push({ title: t("history.yesterday"), data: yesterdayRecords });
    }
    for (const [dateKey, records] of olderRecords) {
      result.push({ title: dateKey, data: records });
    }

    return result;
  }, [filteredHistory, sortBy, t]);

  const handleChannelPress = useCallback(
    (channel: Channel) => {
      router.push({
        pathname: "/player/[channelId]",
        params: { channelId: channel.id },
      });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: HistoryRecord }) => (
      <View className="flex-row items-center">
        <View className="flex-1">
          <ChannelItem channel={item.channel} onPress={handleChannelPress} />
        </View>
        <Text className="text-xs text-muted-foreground pr-4">
          {formatRelativeTime(item.watchedAt, t)}
        </Text>
      </View>
    ),
    [handleChannelPress, t]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: HistorySection }) => (
      <View className="px-4 py-2 bg-muted/30 border-b border-border">
        <Text className="text-sm font-semibold text-muted-foreground">
          {section.title}
        </Text>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: HistoryRecord) => `${item.channel.id}-${item.watchedAt}`,
    []
  );

  // Empty state
  if (history.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Search bar */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-muted rounded-lg px-3">
          <Search size={24} className="text-muted-foreground" />
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("history.search")}
            className="flex-1 border-0 bg-transparent"
            accessibilityLabel={t("history.search")}
            accessibilityRole="search"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery("")}
              className="min-h-11 min-w-11 items-center justify-center active:opacity-70"
              accessibilityLabel={t("common.clear")}
              accessibilityRole="button"
            >
              <X size={24} className="text-muted-foreground" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Toolbar: Sort + Clear */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-border">
        {/* Sort Button */}
        <Pressable
          onPress={handleSortPress}
          className="flex-row items-center min-h-11 active:opacity-70"
          accessibilityLabel={`${t("channel.sortLabel")} ${currentSortLabel}`}
          accessibilityRole="button"
        >
          <Text className="text-sm text-muted-foreground mr-1">
            {t("channel.sortLabel")}
          </Text>
          <Text className="text-sm">{currentSortLabel}</Text>
          <ChevronDown size={24} className="text-muted-foreground ml-1" />
        </Pressable>

        {/* Clear Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Pressable
              className="flex-row items-center px-3 py-2 rounded-lg active:bg-muted min-h-11"
              accessibilityLabel={t("history.clear")}
              accessibilityRole="button"
            >
              <Trash2 size={20} className="text-destructive mr-1" />
              <Text className="text-sm text-destructive">
                {t("history.clear")}
              </Text>
            </Pressable>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("history.clear")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("history.clearConfirm")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>{t("common.cancel")}</Text>
              </AlertDialogCancel>
              <AlertDialogAction
                onPress={clearHistory}
                className="bg-destructive"
              >
                <Text className="text-destructive-foreground">
                  {t("common.confirm")}
                </Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>

      {/* History list or no results */}
      {sections.length === 0 ? (
        <NoResultsState />
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={keyExtractor}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}
