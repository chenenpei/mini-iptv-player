import { memo } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { ChevronRight } from "@/utils/icons";
import type { ReactNode } from "react";

interface SettingsRowProps {
  icon?: ReactNode;
  label: string;
  value?: string;
  showArrow?: boolean;
  onPress?: () => void;
  rightElement?: ReactNode;
  accessibilityLabel?: string;
  isLast?: boolean;
}

export const SettingsRow = memo(function SettingsRow({
  icon,
  label,
  value,
  showArrow = false,
  onPress,
  rightElement,
  accessibilityLabel,
  isLast = false,
}: SettingsRowProps) {
  const content = (
    <View
      className={`flex-row items-center px-4 py-3 min-h-12 ${
        !isLast ? "border-b border-border" : ""
      }`}
    >
      {icon && <View className="mr-3">{icon}</View>}
      <Text className="flex-1 text-base text-foreground">{label}</Text>
      {value && (
        <Text className="text-base text-muted-foreground mr-1">{value}</Text>
      )}
      {rightElement}
      {showArrow && (
        <ChevronRight size={20} className="text-muted-foreground ml-1" />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className="active:bg-muted/50"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return content;
});
