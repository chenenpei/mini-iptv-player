import { useState, useCallback } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "@/utils/icons";
import { useSourceStore } from "@/stores/useSourceStore";
import { useTranslation } from "react-i18next";
import { useRouter, Stack } from "expo-router";

export default function AddSourceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const addSource = useSourceStore((state) => state.addSource);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [nameError, setNameError] = useState("");
  const [urlError, setUrlError] = useState("");

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
    if (!validateForm()) return;

    addSource({
      name: name.trim(),
      url: url.trim(),
      enabled,
      isDefault: false,
    });

    router.back();
  }, [validateForm, addSource, name, url, enabled, router]);

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={handleCancel}
              className="min-h-11 min-w-11 items-center justify-center active:opacity-70 -ml-2"
              accessibilityLabel={t("common.back")}
              accessibilityRole="button"
            >
              <ArrowLeft size={24} className="text-foreground" />
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
        </View>
      </ScrollView>
    </>
  );
}
