import { useEffect } from "react";
import { useChannelStore } from "@stores/useChannelStore";
import type { Channel, ChannelStatus } from "@/types/channel";

const CHECK_TIMEOUT = 8000; // 8 seconds (streaming servers can be slow)
const MAX_CONCURRENT = 3; // Max concurrent requests
const MOUNT_DELAY = 300; // Delay before starting checks after mount
const checkedUrls = new Set<string>();
const pendingQueue: Channel[] = [];
let activeRequests = 0;
let isProcessingPaused = false;
let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

async function checkChannelStatus(url: string): Promise<ChannelStatus> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);

  try {
    // Use GET instead of HEAD - many streaming servers don't support HEAD
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    clearTimeout(timeoutId);

    // We got response headers, that's enough to know it's reachable
    // Don't read the body to save bandwidth
    const isAvailable = response.ok;

    // Abort to stop downloading body
    controller.abort();

    return isAvailable ? "available" : "unavailable";
  } catch {
    clearTimeout(timeoutId);
    return "unavailable";
  }
}

let storeSetStatus: ((id: string, status: ChannelStatus) => void) | null = null;

function processQueue() {
  if (isProcessingPaused) return;

  while (activeRequests < MAX_CONCURRENT && pendingQueue.length > 0) {
    const channel = pendingQueue.shift();
    if (!channel) break;

    // Skip if already checked
    if (checkedUrls.has(channel.url)) {
      continue;
    }

    checkedUrls.add(channel.url);
    activeRequests++;

    checkChannelStatus(channel.url)
      .then((status) => {
        if (storeSetStatus) {
          storeSetStatus(channel.id, status);
        }
      })
      .finally(() => {
        activeRequests--;
        processQueue();
      });
  }
}

// Pause processing and schedule resume after delay
function scheduleProcessing() {
  isProcessingPaused = true;
  if (resumeTimeout) {
    clearTimeout(resumeTimeout);
  }
  resumeTimeout = setTimeout(() => {
    isProcessingPaused = false;
    processQueue();
  }, MOUNT_DELAY);
}

export function useChannelStatusCheck(channel: Channel) {
  const setStatus = useChannelStore((state) => state.setStatus);
  // Only subscribe to this channel's status
  const currentStatus = useChannelStore(
    (state) => state.statusMap[channel.id]
  );

  // Store reference to setStatus for the queue processor
  storeSetStatus = setStatus;

  useEffect(() => {
    // Skip if already checked or in queue
    if (checkedUrls.has(channel.url)) {
      return;
    }

    // Skip if status already known
    if (currentStatus && currentStatus !== "unknown") {
      return;
    }

    // Skip if already in queue
    if (pendingQueue.some((c) => c.id === channel.id)) {
      return;
    }

    // Add to queue and schedule processing
    pendingQueue.push(channel);
    scheduleProcessing();
  }, [channel.id, channel.url, currentStatus]);
}

export function clearStatusCache() {
  checkedUrls.clear();
  pendingQueue.length = 0;
  activeRequests = 0;
}
