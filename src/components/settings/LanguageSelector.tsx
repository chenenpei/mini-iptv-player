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
import { Globe, Check } from "@/utils/icons";
import { useSettingsStore, type Language } from "@/stores/useSettingsStore";
import { useTranslation } from "react-i18next";

interface LanguageOptionProps {
  lang: Language;
  label: string;
  isSelected: boolean;
  onPress: (lang: Language) => void;
  isLast?: boolean;
}

const LanguageOption = memo(function LanguageOption({
  lang,
  label,
  isSelected,
  onPress,
  isLast = false,
}: LanguageOptionProps) {
  const handlePress = useCallback(() => {
    onPress(lang);
  }, [lang, onPress]);

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
      <Globe size={20} className="text-muted-foreground mr-3" />
      <Text className="flex-1 text-base text-foreground">{label}</Text>
      {isSelected && <Check size={20} className="text-primary" />}
    </Pressable>
  );
});

interface LanguageSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LanguageSelectorDialog = memo(function LanguageSelectorDialog({
  open,
  onOpenChange,
}: LanguageSelectorDialogProps) {
  const { t, i18n } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const handleSelect = useCallback(
    (lang: Language) => {
      setLanguage(lang);
      i18n.changeLanguage(lang);
      onOpenChange(false);
    },
    [setLanguage, i18n, onOpenChange]
  );

  const options = useMemo(
    () => [
      {
        lang: "zh" as Language,
        label: t("settings.languageZh"),
      },
      {
        lang: "en" as Language,
        label: t("settings.languageEn"),
      },
    ],
    [t]
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-0 max-w-xs">
        <AlertDialogHeader className="px-4 pt-4 pb-2">
          <AlertDialogTitle className="text-center">
            {t("settings.language")}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <View>
          {options.map((option, index) => (
            <LanguageOption
              key={option.lang}
              lang={option.lang}
              label={option.label}
              isSelected={language === option.lang}
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
