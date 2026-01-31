import { memo, useCallback } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Radio } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import type { Source } from "@/types/source";

interface SourceCardProps {
  source: Source;
  onToggle: (id: string) => void;
  onEdit: (source: Source) => void;
  onDelete: (source: Source) => void;
}

export const SourceCard = memo(function SourceCard({
  source,
  onToggle,
  onEdit,
  onDelete,
}: SourceCardProps) {
  const { t } = useTranslation();

  const handleToggle = useCallback(() => {
    onToggle(source.id);
  }, [onToggle, source.id]);

  const handleEdit = useCallback(() => {
    onEdit(source);
  }, [onEdit, source]);

  const handleDelete = useCallback(() => {
    onDelete(source);
  }, [onDelete, source]);

  return (
    <View className="bg-card rounded-xl mx-4 mb-3 overflow-hidden">
      <View className="px-4 py-3">
        {/* Header: Name + Default badge + Switch */}
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center flex-1 mr-2">
            <Radio size={18} className="text-muted-foreground mr-2" />
            <Text className="text-base font-medium text-foreground" numberOfLines={1}>
              {source.name}
            </Text>
            {source.isDefault && (
              <View className="bg-muted px-2 py-0.5 rounded ml-2">
                <Text className="text-xs text-muted-foreground">
                  {t("sources.default")}
                </Text>
              </View>
            )}
          </View>
          <Switch
            checked={source.enabled}
            onCheckedChange={handleToggle}
            accessibilityLabel={`${t("sources.enabled")} ${source.name}`}
          />
        </View>

        {/* URL */}
        <Text
          className="text-sm text-muted-foreground ml-6 mb-2"
          numberOfLines={1}
        >
          {source.url}
        </Text>

        {/* Actions: Edit + Delete */}
        <View className="flex-row justify-end">
          <Pressable
            onPress={handleEdit}
            className="flex-row items-center px-3 py-2 rounded-lg active:bg-muted min-h-11"
            accessibilityLabel={`${t("common.edit")} ${source.name}`}
            accessibilityRole="button"
          >
            <Edit size={16} className="text-muted-foreground mr-1" />
            <Text className="text-sm text-muted-foreground">
              {t("common.edit")}
            </Text>
          </Pressable>

          {!source.isDefault && (
            <Pressable
              onPress={handleDelete}
              className="flex-row items-center px-3 py-2 rounded-lg active:bg-muted min-h-11 ml-2"
              accessibilityLabel={`${t("common.delete")} ${source.name}`}
              accessibilityRole="button"
            >
              <Trash2 size={16} className="text-destructive mr-1" />
              <Text className="text-sm text-destructive">
                {t("common.delete")}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
});
