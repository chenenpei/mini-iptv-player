import { View } from "react-native";
import type { ChannelStatus } from "@/types/channel";
import { cn } from "@utils/cn";

interface StatusIndicatorProps {
  status: ChannelStatus;
  size?: "sm" | "md";
}

const statusColors: Record<ChannelStatus, string> = {
  available: "bg-green-500",
  unavailable: "bg-red-500",
  unknown: "bg-gray-500",
};

export function StatusIndicator({
  status,
  size = "sm",
}: StatusIndicatorProps) {
  const sizeClass = size === "sm" ? "h-2 w-2" : "h-3 w-3";

  return (
    <View
      testID="status-dot"
      className={cn("rounded-full", sizeClass, statusColors[status])}
    />
  );
}
