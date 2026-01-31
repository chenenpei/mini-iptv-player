import { useState, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { ThemeSelectorDialog } from "@/components/settings/ThemeSelector";
import { LanguageSelectorDialog } from "@/components/settings/LanguageSelector";
import { Radio, Sun, Moon, Monitor, Globe, Info } from "@/utils/icons";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const language = useSettingsStore((state) => state.language);

  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);

  const handleSourcesPress = useCallback(() => {
    router.push("/settings/sources");
  }, [router]);

  const handleAboutPress = useCallback(() => {
    router.push("/settings/about");
  }, [router]);

  const handleThemePress = useCallback(() => {
    setThemeDialogOpen(true);
  }, []);

  const handleLanguagePress = useCallback(() => {
    setLanguageDialogOpen(true);
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
            onPress={handleThemePress}
            accessibilityLabel={`${t("settings.theme")}, ${getThemeLabel()}`}
          />
          <SettingsRow
            icon={<Globe size={20} className="text-muted-foreground" />}
            label={t("settings.language")}
            value={getLanguageLabel()}
            onPress={handleLanguagePress}
            accessibilityLabel={`${t("settings.language")}, ${getLanguageLabel()}`}
            isLast
          />
        </SettingsGroup>

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

      {/* Theme Selector Dialog */}
      <ThemeSelectorDialog
        open={themeDialogOpen}
        onOpenChange={setThemeDialogOpen}
      />

      {/* Language Selector Dialog */}
      <LanguageSelectorDialog
        open={languageDialogOpen}
        onOpenChange={setLanguageDialogOpen}
      />
    </ScrollView>
  );
}
