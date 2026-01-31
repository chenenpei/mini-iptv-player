import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function SettingsLayout() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="sources/index"
        options={{
          title: t("sources.title"),
        }}
      />
      <Stack.Screen
        name="sources/add"
        options={{
          title: t("sources.add"),
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="sources/[sourceId]"
        options={{
          title: t("sources.edit"),
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: t("about.title"),
        }}
      />
    </Stack>
  );
}
