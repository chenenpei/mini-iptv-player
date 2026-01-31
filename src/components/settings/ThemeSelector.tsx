import { memo, useCallback, useMemo } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Sun, Moon, Monitor, Check } from "@/utils/icons";
import { useSettingsStore, type ThemeMode } from "@/stores/useSettingsStore";
import { useTranslation } from "react-i18next";

interface ThemeOptionProps {
  mode: ThemeMode;
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onPress: (mode: ThemeMode) => void;
  isLast?: boolean;
}

const ThemeOption = memo(function ThemeOption({
  mode,
  icon,
  label,
  isSelected,
  onPress,
  isLast = false,
}: ThemeOptionProps) {
  const handlePress = useCallback(() => {
    onPress(mode);
  }, [mode, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-row items-center px-4 py-3 min-h-12 active:bg-muted/50 ${
        !isLast ? "border-b border-border" : ""
      }`}
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
    >
      <View className="mr-3">{icon}</View>
      <Text className="flex-1 text-base text-foreground">{label}</Text>
      {isSelected && <Check size={20} className="text-primary" />}
    </Pressable>
  );
});

export const ThemeSelector = memo(function ThemeSelector() {
  const { t } = useTranslation();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);

  const handleSelect = useCallback(
    (mode: ThemeMode) => {
      setThemeMode(mode);
    },
    [setThemeMode]
  );

  const options = useMemo(
    () => [
      {
        mode: "system" as ThemeMode,
        icon: <Monitor size={20} className="text-muted-foreground" />,
        label: t("settings.themeSystem"),
      },
      {
        mode: "light" as ThemeMode,
        icon: <Sun size={20} className="text-muted-foreground" />,
        label: t("settings.themeLight"),
      },
      {
        mode: "dark" as ThemeMode,
        icon: <Moon size={20} className="text-muted-foreground" />,
        label: t("settings.themeDark"),
      },
    ],
    [t]
  );

  return (
    <View className="bg-card rounded-xl mx-4 overflow-hidden">
      {options.map((option, index) => (
        <ThemeOption
          key={option.mode}
          mode={option.mode}
          icon={option.icon}
          label={option.label}
          isSelected={themeMode === option.mode}
          onPress={handleSelect}
          isLast={index === options.length - 1}
        />
      ))}
    </View>
  );
});
