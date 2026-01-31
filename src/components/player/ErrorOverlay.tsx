import { memo, useCallback } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@components/ui/text";
import { AlertCircle, RotateCcw } from "@utils/icons";
import { useTranslation } from "react-i18next";

interface ErrorOverlayProps {
  visible: boolean;
  message?: string | null;
  onRetry?: () => void;
}

export const ErrorOverlay = memo(function ErrorOverlay({
  visible,
  message,
  onRetry,
}: ErrorOverlayProps) {
  const { t } = useTranslation();

  const handleRetry = useCallback(() => {
    onRetry?.();
  }, [onRetry]);

  if (!visible) return null;

  return (
    <View
      className="absolute inset-0 items-center justify-center bg-black/80"
      accessibilityLabel={message || t("player.error")}
      accessibilityRole="alert"
    >
      <AlertCircle size={48} className="text-red-500" />
      <Text className="text-white mt-4 text-lg font-medium">
        {t("player.error")}
      </Text>
      <Text className="text-white/70 mt-2 text-sm text-center px-8">
        {message || t("player.errorHint")}
      </Text>

      {onRetry && (
        <Pressable
          onPress={handleRetry}
          className="flex-row items-center mt-6 px-6 py-3 bg-white/20 rounded-full active:bg-white/30 min-h-11 min-w-11"
          accessibilityLabel={t("player.retry")}
          accessibilityRole="button"
          accessibilityHint={t("player.retryHint")}
        >
          <RotateCcw size={20} className="text-white mr-2" />
          <Text className="text-white font-medium">{t("player.retry")}</Text>
        </Pressable>
      )}
    </View>
  );
});
