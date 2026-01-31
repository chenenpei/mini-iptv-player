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
import { Star, Search, X, Trash2 } from "@/utils/icons";
import { useRouter } from "expo-router";
import type { Channel } from "@/types/channel";

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

  const favorites = useFavoriteStore((state) => state.favorites);
  const clearFavorites = useFavoriteStore((state) => state.clearFavorites);

  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) {
      return favorites;
    }
    const query = searchQuery.toLowerCase();
    return favorites.filter(
      (channel) =>
        channel.name.toLowerCase().includes(query) ||
        channel.tvgName?.toLowerCase().includes(query)
    );
  }, [favorites, searchQuery]);

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
      {/* Header with clear button */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <Text className="text-lg font-semibold">{t("favorites.title")}</Text>
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
                <Text>{t("common.cancel")}</Text>
              </AlertDialogCancel>
              <AlertDialogAction
                onPress={clearFavorites}
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

      {/* Search bar */}
      <View className="px-4 pb-2">
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

      {/* Channel list or no results */}
      {filteredFavorites.length === 0 ? (
        <NoResultsState />
      ) : (
        <FlatList
          data={filteredFavorites}
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
