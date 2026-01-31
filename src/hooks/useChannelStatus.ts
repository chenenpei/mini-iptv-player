import { useEffect, useRef } from "react";
import PQueue from "p-queue";
import { useChannelStore } from "@stores/useChannelStore";
import type { Channel, ChannelStatus } from "@/types/channel";

const CHECK_TIMEOUT = 5000; // 5 seconds
const MAX_CONCURRENT = 3; // Max concurrent requests
const MOUNT_DELAY = 500; // Delay before starting checks after mount
const BETWEEN_CHECKS_DELAY = 100; // Delay between each check

// Shared queue instance with concurrency control and interval
const queue = new PQueue({
  concurrency: MAX_CONCURRENT,
  interval: BETWEEN_CHECKS_DELAY,
  intervalCap: 1,
});

// Track checked URLs to avoid duplicate requests
const checkedUrls = new Set<string>();

// Debounce timer for batch processing
let mountDebounceTimer: ReturnType<typeof setTimeout> | null = null;

async function checkChannelStatus(url: string): Promise<ChannelStatus> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);

  try {
    // First try HEAD request (lightweight, no body)
    let response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // If HEAD not supported (405) or other client error, try GET with Range
    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Range: "bytes=0-0", // Only request first byte
        },
      });
    }

    clearTimeout(timeoutId);
    controller.abort(); // Stop any remaining data transfer

    return response.ok || response.status === 206 ? "available" : "unavailable";
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
    // DISABLED: Auto status check causes UI lag due to JS thread blocking
    // TODO: Move to native module or Web Worker in M6
    return;

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

// Pause/resume status checking (useful when entering player)
export function pauseStatusCheck() {
  queue.pause();
}

export function resumeStatusCheck() {
  queue.start();
}

// Export queue for advanced usage (e.g., priority control)
export { queue as statusCheckQueue };
