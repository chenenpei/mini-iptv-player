import { View } from "react-native";
import type { ReactNode } from "react";

interface SettingsGroupProps {
  children: ReactNode;
}

export function SettingsGroup({ children }: SettingsGroupProps) {
  return (
    <View className="bg-card rounded-2xl mx-4 mb-4 overflow-hidden border border-border">
      {children}
    </View>
  );
}
