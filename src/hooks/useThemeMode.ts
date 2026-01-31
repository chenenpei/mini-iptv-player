import { useColorScheme } from "react-native";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function useThemeMode() {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const systemColorScheme = useColorScheme();

  const resolvedTheme =
    themeMode === "system" ? (systemColorScheme ?? "light") : themeMode;

  return {
    themeMode,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
  };
}
