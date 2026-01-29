import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold text-foreground">
        {t("settings.title")}
      </Text>
      <Text className="mt-2 text-muted-foreground">
        {t("settings.sources")}
      </Text>
    </View>
  );
}
