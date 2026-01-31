import { View } from "react-native";
import { Text } from "@/components/ui/text";
import type { ReactNode } from "react";

interface SettingsGroupProps {
  title?: string;
  children: ReactNode;
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <View className="mb-6">
      {title && (
        <Text className="text-xs text-muted-foreground uppercase tracking-wide px-4 mb-2">
          {title}
        </Text>
      )}
      <View className="bg-card rounded-xl mx-4 overflow-hidden">{children}</View>
    </View>
  );
}
