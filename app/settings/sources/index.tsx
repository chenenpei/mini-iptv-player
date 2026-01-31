import { useCallback } from "react";
import { View, FlatList, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { SourceCard } from "@/components/settings/SourceCard";
import { Radio, Plus } from "@/utils/icons";
import { useSourceStore } from "@/stores/useSourceStore";
import { useTranslation } from "react-i18next";
import { useRouter, Stack } from "expo-router";
import type { Source } from "@/types/source";

function EmptyState() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Radio size={48} className="text-muted-foreground mb-4" />
      <Text className="text-base font-medium text-center">
        {t("sources.empty")}
      </Text>
      <Text className="text-sm text-muted-foreground text-center mt-2">
        {t("sources.emptyHint")}
      </Text>
    </View>
  );
}

export default function SourcesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const sources = useSourceStore((state) => state.sources);
  const toggleSource = useSourceStore((state) => state.toggleSource);

  const handleAddPress = useCallback(() => {
    router.push("/settings/sources/add");
  }, [router]);

  const handleToggle = useCallback(
    (id: string) => {
      toggleSource(id);
    },
    [toggleSource]
  );

  const handlePress = useCallback(
    (source: Source) => {
      router.push({
        pathname: "/settings/sources/[sourceId]",
        params: { sourceId: source.id },
      });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: Source }) => (
      <SourceCard
        source={item}
        onToggle={handleToggle}
        onPress={handlePress}
      />
    ),
    [handleToggle, handlePress]
  );

  const keyExtractor = useCallback((item: Source) => item.id, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={handleAddPress}
              className="min-h-11 min-w-11 items-center justify-center active:opacity-70"
              accessibilityLabel={t("sources.add")}
              accessibilityRole="button"
            >
              <Plus size={24} className="text-foreground" />
            </Pressable>
          ),
        }}
      />
      <View className="flex-1 bg-background">
        {sources.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={sources}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          />
        )}
      </View>
    </>
  );
}
