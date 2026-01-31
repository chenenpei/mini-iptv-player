import { memo } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "@components/ui/text";
import { useTranslation } from "react-i18next";

interface LoadingOverlayProps {
  visible: boolean;
}

export const LoadingOverlay = memo(function LoadingOverlay({
  visible,
}: LoadingOverlayProps) {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <View
      className="absolute inset-0 items-center justify-center bg-black/60"
      accessibilityLabel={t("player.loading")}
      accessibilityRole="progressbar"
    >
      <ActivityIndicator size="large" color="#ffffff" />
      <Text className="text-white mt-3 text-base">{t("player.loading")}</Text>
    </View>
  );
});
