import { useState, useCallback } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { Radio, Sun, Moon, Monitor, Globe, Info } from "@/utils/icons";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const language = useSettingsStore((state) => state.language);

  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleSourcesPress = useCallback(() => {
    router.push("/settings/sources");
  }, [router]);

  const handleAboutPress = useCallback(() => {
    router.push("/settings/about");
  }, [router]);

  const toggleThemeSelector = useCallback(() => {
    setShowThemeSelector((prev) => !prev);
    setShowLanguageSelector(false);
  }, []);

  const toggleLanguageSelector = useCallback(() => {
    setShowLanguageSelector((prev) => !prev);
    setShowThemeSelector(false);
  }, []);

  const getThemeLabel = () => {
    switch (themeMode) {
      case "system":
        return t("settings.themeSystem");
      case "light":
        return t("settings.themeLight");
      case "dark":
        return t("settings.themeDark");
    }
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case "system":
        return <Monitor size={20} className="text-muted-foreground" />;
      case "light":
        return <Sun size={20} className="text-muted-foreground" />;
      case "dark":
        return <Moon size={20} className="text-muted-foreground" />;
    }
  };

  const getLanguageLabel = () => {
    return language === "zh"
      ? t("settings.languageZh")
      : t("settings.languageEn");
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="pt-4">
        {/* IPTV Sources Section */}
        <SettingsGroup>
          <SettingsRow
            icon={<Radio size={20} className="text-muted-foreground" />}
            label={t("settings.sources")}
            showArrow
            onPress={handleSourcesPress}
            isLast
          />
        </SettingsGroup>

        {/* Appearance Section */}
        <SettingsGroup title={t("settings.appearance")}>
          <SettingsRow
            icon={getThemeIcon()}
            label={t("settings.theme")}
            value={getThemeLabel()}
            onPress={toggleThemeSelector}
            accessibilityLabel={`${t("settings.theme")}, ${getThemeLabel()}`}
          />
          <SettingsRow
            icon={<Globe size={20} className="text-muted-foreground" />}
            label={t("settings.language")}
            value={getLanguageLabel()}
            onPress={toggleLanguageSelector}
            accessibilityLabel={`${t("settings.language")}, ${getLanguageLabel()}`}
            isLast
          />
        </SettingsGroup>

        {/* Theme Selector (expanded) */}
        {showThemeSelector && (
          <View className="mb-6">
            <ThemeSelector />
          </View>
        )}

        {/* Language Selector (expanded) */}
        {showLanguageSelector && (
          <View className="mb-6">
            <LanguageSelector />
          </View>
        )}

        {/* About Section */}
        <SettingsGroup>
          <SettingsRow
            icon={<Info size={20} className="text-muted-foreground" />}
            label={t("settings.about")}
            showArrow
            onPress={handleAboutPress}
            isLast
          />
        </SettingsGroup>
      </View>
    </ScrollView>
  );
}
