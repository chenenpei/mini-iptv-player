import { View, Pressable } from "react-native";
import { Text } from "@components/ui/text";
import { useChannelStore, type SortBy } from "@stores/useChannelStore";
import { useTranslation } from "react-i18next";
import { ChevronDown, List, LayoutGrid } from "@utils/icons";

export function Toolbar() {
  const { t } = useTranslation();
  const sortBy = useChannelStore((state) => state.sortBy);
  const setSortBy = useChannelStore((state) => state.setSortBy);
  const layoutMode = useChannelStore((state) => state.layoutMode);
  const setLayoutMode = useChannelStore((state) => state.setLayoutMode);

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: "name", label: t("channel.sortByName") },
    { value: "status", label: t("channel.sortByStatus") },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label ?? "";

  const handleSortPress = () => {
    // Cycle through sort options
    const currentIndex = sortOptions.findIndex((opt) => opt.value === sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex].value);
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-2 border-b border-border">
      {/* Sort Button */}
      <Pressable
        onPress={handleSortPress}
        className="flex-row items-center min-h-11 active:opacity-70"
        accessibilityLabel={`${t("channel.sortLabel")} ${currentSortLabel}`}
        accessibilityRole="button"
        accessibilityHint={t("channel.sortHint")}
      >
        <Text className="text-sm text-muted-foreground mr-1">
          {t("channel.sortLabel")}
        </Text>
        <Text className="text-sm">{currentSortLabel}</Text>
        <ChevronDown size={24} className="text-muted-foreground ml-1" />
      </Pressable>

      {/* Layout Toggle */}
      <View className="flex-row items-center">
        <Pressable
          onPress={() => setLayoutMode("list")}
          className={`p-3 rounded-lg active:opacity-70 ${layoutMode === "list" ? "bg-muted" : ""}`}
          accessibilityLabel={t("channel.listView")}
          accessibilityRole="button"
          accessibilityState={{ selected: layoutMode === "list" }}
        >
          <List
            size={24}
            className={
              layoutMode === "list" ? "text-foreground" : "text-muted-foreground"
            }
          />
        </Pressable>
        <Pressable
          onPress={() => setLayoutMode("grid")}
          className={`p-3 rounded-lg ml-2 active:opacity-70 ${layoutMode === "grid" ? "bg-muted" : ""}`}
          accessibilityLabel={t("channel.gridView")}
          accessibilityRole="button"
          accessibilityState={{ selected: layoutMode === "grid" }}
        >
          <LayoutGrid
            size={24}
            className={
              layoutMode === "grid" ? "text-foreground" : "text-muted-foreground"
            }
          />
        </Pressable>
      </View>
    </View>
  );
}
