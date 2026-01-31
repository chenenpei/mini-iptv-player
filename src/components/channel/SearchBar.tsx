import { useState, useEffect, useRef, useCallback } from "react";
import { View, Pressable } from "react-native";
import { Input } from "@components/ui/input";
import { Search, X } from "@utils/icons";
import { useChannelStore } from "@stores/useChannelStore";
import { useTranslation } from "react-i18next";

const DEBOUNCE_MS = 300;

export function SearchBar() {
  const { t } = useTranslation();
  const searchQuery = useChannelStore((state) => state.searchQuery);
  const setSearchQuery = useChannelStore((state) => state.setSearchQuery);

  // Local state for immediate input feedback
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when store changes externally (e.g., clear button)
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleChangeText = useCallback((text: string) => {
    setLocalQuery(text);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce the store update
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(text);
    }, DEBOUNCE_MS);
  }, [setSearchQuery]);

  const handleClear = useCallback(() => {
    // Clear immediately without debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setLocalQuery("");
    setSearchQuery("");
  }, [setSearchQuery]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <View className="px-4 pt-4 pb-2">
      <View className="flex-row items-center bg-muted rounded-lg px-3">
        <Search size={24} className="text-muted-foreground" />
        <Input
          value={localQuery}
          onChangeText={handleChangeText}
          placeholder={t("home.searchPlaceholder")}
          className="flex-1 border-0 bg-transparent"
          accessibilityLabel={t("home.searchPlaceholder")}
          accessibilityRole="search"
        />
        {localQuery.length > 0 && (
          <Pressable
            onPress={handleClear}
            className="min-h-11 min-w-11 items-center justify-center active:opacity-70"
            accessibilityLabel={t("common.clear")}
            accessibilityRole="button"
          >
            <X size={24} className="text-muted-foreground" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
