import { memo, useCallback, useMemo } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSettingsStore, type ThemeMode } from "@/stores/useSettingsStore";
import { useTranslation } from "react-i18next";

interface RadioOptionProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const RadioOption = memo(function RadioOption({
  label,
  isSelected,
  onPress,
}: RadioOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-3 active:bg-muted/30"
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
    >
      <View
        className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-4 ${
          isSelected ? "border-primary" : "border-muted-foreground"
        }`}
      >
        {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </View>
      <Text className="text-base text-foreground">{label}</Text>
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

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const options = useMemo(
    () => [
      { mode: "system" as ThemeMode, label: t("settings.themeSystem") },
      { mode: "light" as ThemeMode, label: t("settings.themeLight") },
      { mode: "dark" as ThemeMode, label: t("settings.themeDark") },
    ],
    [t]
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-80 p-0">
        <AlertDialogHeader className="px-6 pt-6 pb-2">
          <AlertDialogTitle className="text-left text-lg">
            {t("settings.theme")}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <View className="px-6">
          {options.map((option) => (
            <RadioOption
              key={option.mode}
              label={option.label}
              isSelected={themeMode === option.mode}
              onPress={() => handleSelect(option.mode)}
            />
          ))}
        </View>

        <View className="flex-row justify-end px-4 py-4">
          <Pressable
            onPress={handleCancel}
            className="px-4 py-2 active:opacity-70"
            accessibilityLabel={t("common.cancel")}
            accessibilityRole="button"
          >
            <Text className="text-primary font-medium uppercase">
              {t("common.cancel")}
            </Text>
          </Pressable>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
});
