import { useCallback, useState } from "react";
import { View, FlatList, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { SourceCard } from "@/components/settings/SourceCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const removeSource = useSourceStore((state) => state.removeSource);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<Source | null>(null);

  const handleAddPress = useCallback(() => {
    router.push("/settings/sources/add");
  }, [router]);

  const handleToggle = useCallback(
    (id: string) => {
      toggleSource(id);
    },
    [toggleSource]
  );

  const handleEdit = useCallback(
    (source: Source) => {
      router.push({
        pathname: "/settings/sources/[sourceId]",
        params: { sourceId: source.id },
      });
    },
    [router]
  );

  const handleDelete = useCallback((source: Source) => {
    setSourceToDelete(source);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (sourceToDelete) {
      removeSource(sourceToDelete.id);
      setSourceToDelete(null);
      setDeleteDialogOpen(false);
    }
  }, [sourceToDelete, removeSource]);

  const cancelDelete = useCallback(() => {
    setSourceToDelete(null);
    setDeleteDialogOpen(false);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Source }) => (
      <SourceCard
        source={item}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
    [handleToggle, handleEdit, handleDelete]
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("sources.deleteTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("sources.deleteDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onPress={cancelDelete}>
                <Text>{t("common.cancel")}</Text>
              </AlertDialogCancel>
              <AlertDialogAction onPress={confirmDelete} className="bg-destructive">
                <Text className="text-destructive-foreground">
                  {t("common.delete")}
                </Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>
    </>
  );
}
