import { memo, useCallback, useMemo } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
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

interface ThemeSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThemeSelectorDialog = memo(function ThemeSelectorDialog({
  open,
  onOpenChange,
}: ThemeSelectorDialogProps) {
  const { t } = useTranslation();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);

  const handleSelect = useCallback(
    (mode: ThemeMode) => {
      setThemeMode(mode);
      onOpenChange(false);
    },
    [setThemeMode, onOpenChange]
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-0 max-w-xs">
        <AlertDialogHeader className="px-4 pt-4 pb-2">
          <AlertDialogTitle className="text-center">
            {t("settings.theme")}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <View>
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
        <View className="p-4 pt-2">
          <AlertDialogCancel>
            <Text>{t("common.cancel")}</Text>
          </AlertDialogCancel>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
});
