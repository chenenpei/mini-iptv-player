import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";
import { Clock } from "@/utils/icons";

export default function HistoryScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <Clock size={48} className="text-muted-foreground mb-4" />
      <Text className="text-base font-medium text-center">
        {t("history.empty")}
      </Text>
      <Text className="text-sm text-muted-foreground text-center mt-2">
        {t("history.emptyHint")}
      </Text>
    </View>
  );
}
