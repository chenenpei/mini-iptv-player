import { useEffect, useRef } from "react";
import PQueue from "p-queue";
import { useChannelStore } from "@stores/useChannelStore";
import type { Channel, ChannelStatus } from "@/types/channel";

const CHECK_TIMEOUT = 8000; // 8 seconds (streaming servers can be slow)
const MAX_CONCURRENT = 3; // Max concurrent requests
const MOUNT_DELAY = 300; // Delay before starting checks after mount

// Shared queue instance with concurrency control
const queue = new PQueue({ concurrency: MAX_CONCURRENT });

// Track checked URLs to avoid duplicate requests
const checkedUrls = new Set<string>();

// Debounce timer for batch processing
let mountDebounceTimer: ReturnType<typeof setTimeout> | null = null;

async function checkChannelStatus(url: string): Promise<ChannelStatus> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);

  try {
    // Use GET instead of HEAD - many streaming servers don't support HEAD
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    clearTimeout(timeoutId);

    // We got response headers, that's enough to know it's reachable
    const isAvailable = response.ok;

    // Abort to stop downloading body
    controller.abort();

    return isAvailable ? "available" : "unavailable";
  } catch {
    clearTimeout(timeoutId);
    return "unavailable";
  }
}

// Schedule queue start with debounce to batch initial mounts
function scheduleQueueStart() {
  if (mountDebounceTimer) {
    clearTimeout(mountDebounceTimer);
  }

  // Pause queue while batching
  queue.pause();

  mountDebounceTimer = setTimeout(() => {
    queue.start();
    mountDebounceTimer = null;
  }, MOUNT_DELAY);
}

export function useChannelStatusCheck(channel: Channel) {
  const setStatus = useChannelStore((state) => state.setStatus);
  // Only subscribe to this channel's status
  const currentStatus = useChannelStore(
    (state) => state.statusMap[channel.id]
  );

  // Track if already queued to prevent duplicates
  const isQueued = useRef(false);

  useEffect(() => {
    // Skip if already checked
    if (checkedUrls.has(channel.url)) {
      return;
    }

    // Skip if status already known
    if (currentStatus && currentStatus !== "unknown") {
      return;
    }

    // Skip if already queued
    if (isQueued.current) {
      return;
    }

    isQueued.current = true;
    checkedUrls.add(channel.url);

    // Add to queue with automatic concurrency control
    queue.add(async () => {
      const status = await checkChannelStatus(channel.url);
      setStatus(channel.id, status);
    });

    // Schedule queue start with debounce
    scheduleQueueStart();
  }, [channel.id, channel.url, currentStatus, setStatus]);
}

export function clearStatusCache() {
  checkedUrls.clear();
  queue.clear();
}

// Export queue for advanced usage (e.g., priority control)
export { queue as statusCheckQueue };
