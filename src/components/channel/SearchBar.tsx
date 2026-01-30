import { View, Pressable } from "react-native";
import { Input } from "@components/ui/input";
import { Search, X } from "@utils/icons";
import { useChannelStore } from "@stores/useChannelStore";
import { useTranslation } from "react-i18next";

export function SearchBar() {
  const { t } = useTranslation();
  const searchQuery = useChannelStore((state) => state.searchQuery);
  const setSearchQuery = useChannelStore((state) => state.setSearchQuery);

  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center bg-muted rounded-lg px-3">
        <Search size={20} className="text-muted-foreground" />
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t("home.searchPlaceholder")}
          className="flex-1 border-0 bg-transparent"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
            <X size={20} className="text-muted-foreground" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
