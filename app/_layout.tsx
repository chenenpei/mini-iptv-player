import "../global.css";
import "@i18n/index";

import { NAV_THEME } from "@utils/constants";
import { queryClient } from "@services/queryClient";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useThemeMode } from "@/hooks/useThemeMode";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const { isDark } = useThemeMode();

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: NAV_THEME.dark.background,
      card: NAV_THEME.dark.card,
      border: NAV_THEME.dark.border,
      text: NAV_THEME.dark.text,
      primary: NAV_THEME.dark.primary,
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: NAV_THEME.light.background,
      card: NAV_THEME.light.card,
      border: NAV_THEME.light.border,
      text: NAV_THEME.light.text,
      primary: NAV_THEME.light.primary,
    },
  };

  return (
    <ThemeProvider value={isDark ? customDarkTheme : customLightTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="player/[channelId]" options={{ headerShown: true }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
