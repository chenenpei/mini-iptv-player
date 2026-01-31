import { memo, useCallback } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
import { ChevronRight } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import type { Source } from "@/types/source";

interface SourceCardProps {
  source: Source;
  onToggle: (id: string) => void;
  onPress: (source: Source) => void;
}

export const SourceCard = memo(function SourceCard({
  source,
  onToggle,
  onPress,
}: SourceCardProps) {
  const { t } = useTranslation();

  const handleToggle = useCallback(() => {
    onToggle(source.id);
  }, [onToggle, source.id]);

  const handlePress = useCallback(() => {
    onPress(source);
  }, [onPress, source]);

  return (
    <Pressable
      onPress={handlePress}
      className="bg-card rounded-2xl mx-4 mb-3 border border-border active:opacity-80"
      accessibilityLabel={`${source.name}, ${source.enabled ? t("sources.enabled") : t("sources.disabled")}`}
      accessibilityRole="button"
      accessibilityHint={t("sources.editHint")}
    >
      <View className="p-4">
        {/* Row 1: Name + Default badge */}
        <View className="flex-row items-center mb-1">
          <Text
            className="text-base font-medium text-foreground flex-1"
            numberOfLines={1}
          >
            {source.name}
          </Text>
          {source.isDefault && (
            <View className="bg-muted px-2 py-0.5 rounded">
              <Text className="text-xs text-muted-foreground">
                {t("sources.default")}
              </Text>
            </View>
          )}
        </View>

        {/* Row 2: URL */}
        <Text className="text-sm text-muted-foreground mb-3" numberOfLines={1}>
          {source.url}
        </Text>

        {/* Row 3: Switch + Chevron */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground mr-3">
              {t("sources.enabled")}
            </Text>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              hitSlop={8}
            >
              <Switch
                checked={source.enabled}
                onCheckedChange={handleToggle}
                accessibilityLabel={`${t("sources.enabled")} ${source.name}`}
              />
            </Pressable>
          </View>
          <ChevronRight size={20} className="text-muted-foreground" />
        </View>
      </View>
    </Pressable>
  );
});
