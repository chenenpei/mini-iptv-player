import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";
import { Star } from "@/utils/icons";

export default function FavoritesScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <Star size={48} className="text-muted-foreground mb-4" />
      <Text className="text-base font-medium text-center">
        {t("favorites.empty")}
      </Text>
      <Text className="text-sm text-muted-foreground text-center mt-2">
        {t("favorites.emptyHint")}
      </Text>
    </View>
  );
}
