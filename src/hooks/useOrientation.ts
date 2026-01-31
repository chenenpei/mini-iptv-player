import { useCallback, useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { Platform } from "react-native";

export function useOrientation() {
  // Lock to portrait on mount, unlock on unmount
  useEffect(() => {
    // Only manage orientation on native platforms
    if (Platform.OS === "web") return;

    const setupOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      } catch (e) {
        console.warn("Failed to lock orientation:", e);
      }
    };

    setupOrientation();

    return () => {
      // Unlock orientation when component unmounts
      ScreenOrientation.unlockAsync().catch(() => {});
    };
  }, []);

  const lockToLandscape = useCallback(async () => {
    if (Platform.OS === "web") return;

    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } catch (e) {
      console.warn("Failed to lock to landscape:", e);
    }
  }, []);

  const lockToPortrait = useCallback(async () => {
    if (Platform.OS === "web") return;

    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (e) {
      console.warn("Failed to lock to portrait:", e);
    }
  }, []);

  const unlock = useCallback(async () => {
    if (Platform.OS === "web") return;

    try {
      await ScreenOrientation.unlockAsync();
    } catch (e) {
      console.warn("Failed to unlock orientation:", e);
    }
  }, []);

  return {
    lockToLandscape,
    lockToPortrait,
    unlock,
  };
}
