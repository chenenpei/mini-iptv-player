import { useState, useCallback, useMemo } from "react";
import { View, Pressable, FlatList } from "react-native";
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
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import { useTranslation } from "react-i18next";
import { Star, Search, X, Trash2, ChevronDown } from "@/utils/icons";
import { useRouter } from "expo-router";
import type { Channel } from "@/types/channel";

type SortBy = "name" | "added";

function EmptyState() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Star size={48} className="text-muted-foreground mb-4" />
      <Text className="text-base font-medium text-center">
        {t("favorites.empty")}
      </Text>
      <Text className="text-sm text-muted-foreground text-center mt-2">
        {t("favorites.emptyHint")}
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

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("added");

  const favorites = useFavoriteStore((state) => state.favorites);
  const clearFavorites = useFavoriteStore((state) => state.clearFavorites);

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: "added", label: t("favorites.sortByAdded") },
    { value: "name", label: t("channel.sortByName") },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label ?? "";

  const handleSortPress = () => {
    const currentIndex = sortOptions.findIndex((opt) => opt.value === sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex].value);
  };

  const filteredAndSortedFavorites = useMemo(() => {
    let result = [...favorites];

    // Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (channel) =>
          channel.name.toLowerCase().includes(query) ||
          channel.tvgName?.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    // "added" keeps original order (most recent first)

    return result;
  }, [favorites, searchQuery, sortBy]);

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
    ({ item }: { item: Channel }) => (
      <ChannelItem channel={item} onPress={handleChannelPress} />
    ),
    [handleChannelPress]
  );

  const keyExtractor = useCallback((item: Channel) => item.id, []);

  // Empty state
  if (favorites.length === 0) {
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
            placeholder={t("favorites.search")}
            className="flex-1 border-0 bg-transparent"
            accessibilityLabel={t("favorites.search")}
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
              accessibilityLabel={t("favorites.clear")}
              accessibilityRole="button"
            >
              <Trash2 size={20} className="text-destructive mr-1" />
              <Text className="text-sm text-destructive">
                {t("favorites.clear")}
              </Text>
            </Pressable>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("favorites.clear")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("favorites.clearConfirm")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text className="text-muted-foreground">{t("common.cancel")}</Text>
              </AlertDialogCancel>
              <AlertDialogAction onPress={clearFavorites}>
                <Text className="text-destructive">{t("common.confirm")}</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>

      {/* Channel list or no results */}
      {filteredAndSortedFavorites.length === 0 ? (
        <NoResultsState />
      ) : (
        <FlatList
          data={filteredAndSortedFavorites}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </View>
  );
}
