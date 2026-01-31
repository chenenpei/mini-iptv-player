import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Tv } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";

export default function AboutScreen() {
  const { t } = useTranslation();
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      {/* App Icon */}
      <View className="w-24 h-24 bg-card rounded-3xl items-center justify-center mb-6">
        <Tv size={48} className="text-foreground" />
      </View>

      {/* App Name */}
      <Text className="text-2xl font-bold text-foreground mb-2">
        {t("about.appName")}
      </Text>

      {/* Version */}
      <Text className="text-base text-muted-foreground mb-4">
        {t("about.version", { version })}
      </Text>

      {/* Description */}
      <Text className="text-base text-muted-foreground text-center">
        {t("about.description")}
      </Text>
    </View>
  );
}
