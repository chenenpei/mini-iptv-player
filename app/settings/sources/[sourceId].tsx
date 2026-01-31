import { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSourceStore } from "@/stores/useSourceStore";
import { useTranslation } from "react-i18next";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";

export default function EditSourceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { sourceId } = useLocalSearchParams<{ sourceId: string }>();
  const sources = useSourceStore((state) => state.sources);
  const updateSource = useSourceStore((state) => state.updateSource);

  const source = sources.find((s) => s.id === sourceId);

  const [name, setName] = useState(source?.name ?? "");
  const [url, setUrl] = useState(source?.url ?? "");
  const [enabled, setEnabled] = useState(source?.enabled ?? true);
  const [nameError, setNameError] = useState("");
  const [urlError, setUrlError] = useState("");

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

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(() => {
    if (!validateForm() || !sourceId) return;

    updateSource(sourceId, {
      name: name.trim(),
      url: url.trim(),
      enabled,
    });

    router.back();
  }, [validateForm, updateSource, sourceId, name, url, enabled, router]);

  if (!source) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              onPress={handleCancel}
              className="min-h-11 min-w-11 items-center justify-center active:opacity-70"
              accessibilityLabel={t("common.cancel")}
              accessibilityRole="button"
            >
              <Text className="text-foreground">{t("common.cancel")}</Text>
            </Pressable>
          ),
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
        <View className="pt-6 px-4">
          {/* Default Source Badge */}
          {source.isDefault && (
            <View className="bg-muted rounded-lg px-4 py-3 mb-6">
              <Text className="text-sm text-muted-foreground text-center">
                {t("sources.cannotDelete")}
              </Text>
            </View>
          )}

          {/* Source Name */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-foreground mb-2">
              {t("sources.name")}
            </Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder={t("sources.namePlaceholder")}
              className={nameError ? "border-destructive" : ""}
              accessibilityLabel={t("sources.name")}
            />
            {nameError ? (
              <Text className="text-sm text-destructive mt-1">{nameError}</Text>
            ) : (
              <Text className="text-sm text-muted-foreground mt-1">
                {t("sources.nameHint")}
              </Text>
            )}
          </View>

          {/* Source URL */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-foreground mb-2">
              {t("sources.url")}
            </Text>
            <Input
              value={url}
              onChangeText={setUrl}
              placeholder={t("sources.urlPlaceholder")}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              className={urlError ? "border-destructive" : ""}
              accessibilityLabel={t("sources.url")}
            />
            {urlError ? (
              <Text className="text-sm text-destructive mt-1">{urlError}</Text>
            ) : (
              <Text className="text-sm text-muted-foreground mt-1">
                {t("sources.urlHint")}
              </Text>
            )}
          </View>

          {/* Enable Switch */}
          <View className="bg-card rounded-xl px-4 py-3">
            <View className="flex-row items-center justify-between">
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
        </View>
      </ScrollView>
    </>
  );
}
