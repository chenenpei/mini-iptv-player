import { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { Trash2 } from "@/utils/icons";
import { useSourceStore } from "@/stores/useSourceStore";
import { useTranslation } from "react-i18next";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";

export default function EditSourceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { sourceId } = useLocalSearchParams<{ sourceId: string }>();
  const sources = useSourceStore((state) => state.sources);
  const updateSource = useSourceStore((state) => state.updateSource);
  const removeSource = useSourceStore((state) => state.removeSource);

  const source = sources.find((s) => s.id === sourceId);

  const [name, setName] = useState(source?.name ?? "");
  const [url, setUrl] = useState(source?.url ?? "");
  const [enabled, setEnabled] = useState(source?.enabled ?? true);
  const [nameError, setNameError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Redirect if source not found
  useEffect(() => {
    if (!source) {
      router.back();
    }
  }, [source, router]);

  const validateForm = useCallback(() => {
    let isValid = true;

    if (!name.trim()) {
      setNameError(t("sources.nameRequired"));
      isValid = false;
    } else {
      setNameError("");
    }

    if (!url.trim()) {
      setUrlError(t("sources.urlRequired"));
      isValid = false;
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setUrlError(t("sources.urlInvalid"));
      isValid = false;
    } else {
      setUrlError("");
    }

    return isValid;
  }, [name, url, t]);

  const handleSave = useCallback(() => {
    if (!validateForm() || !sourceId) return;

    updateSource(sourceId, {
      name: name.trim(),
      url: url.trim(),
      enabled,
    });

    router.back();
  }, [validateForm, updateSource, sourceId, name, url, enabled, router]);

  const handleDeletePress = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (sourceId) {
      removeSource(sourceId);
      setDeleteDialogOpen(false);
      router.back();
    }
  }, [sourceId, removeSource, router]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  if (!source) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={handleSave}
              className="min-h-11 min-w-11 items-center justify-center active:opacity-70"
              accessibilityLabel={t("common.save")}
              accessibilityRole="button"
            >
              <Text className="text-primary font-medium">{t("common.save")}</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-background" keyboardShouldPersistTaps="handled">
        <View className="pt-4 px-4">
          {/* Form Card */}
          <View className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Source Name */}
            <View className="px-4 py-3 border-b border-border">
              <Text className="text-xs text-muted-foreground mb-1">
                {t("sources.name")}
              </Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder={t("sources.namePlaceholder")}
                className={`border-0 bg-transparent px-0 h-8 ${nameError ? "text-destructive" : ""}`}
                accessibilityLabel={t("sources.name")}
              />
              {nameError && (
                <Text className="text-xs text-destructive mt-1">{nameError}</Text>
              )}
            </View>

            {/* Source URL */}
            <View className="px-4 py-3 border-b border-border">
              <Text className="text-xs text-muted-foreground mb-1">
                {t("sources.url")}
              </Text>
              <Input
                value={url}
                onChangeText={setUrl}
                placeholder={t("sources.urlPlaceholder")}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                className={`border-0 bg-transparent px-0 h-8 ${urlError ? "text-destructive" : ""}`}
                accessibilityLabel={t("sources.url")}
              />
              {urlError && (
                <Text className="text-xs text-destructive mt-1">{urlError}</Text>
              )}
            </View>

            {/* Enable Switch */}
            <View className="px-4 py-3 flex-row items-center justify-between">
              <Text className="text-base text-foreground">
                {t("sources.enabled")}
              </Text>
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
                accessibilityLabel={t("sources.enabled")}
              />
            </View>
          </View>

          {/* Delete Button or Default Notice */}
          {source.isDefault ? (
            <Text className="mt-8 py-3 text-sm text-muted-foreground text-center">
              {t("sources.cannotDelete")}
            </Text>
          ) : (
            <Pressable
              onPress={handleDeletePress}
              className="mx-0 mt-8 py-3.5 flex-row items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 active:bg-destructive/20"
              accessibilityLabel={t("sources.deleteSource")}
              accessibilityRole="button"
            >
              <Trash2 size={18} className="text-destructive mr-2" />
              <Text className="text-base font-medium text-destructive">
                {t("sources.deleteSource")}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

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
              <Text className="text-muted-foreground">{t("common.cancel")}</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmDelete}>
              <Text className="text-destructive">{t("common.delete")}</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
