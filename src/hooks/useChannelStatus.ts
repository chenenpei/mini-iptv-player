import { useEffect, useRef } from "react";
import { useChannelStore } from "@stores/useChannelStore";
import type { Channel, ChannelStatus } from "@/types/channel";

const CHECK_TIMEOUT = 3000; // 3 seconds
const checkedUrls = new Set<string>();

async function checkChannelStatus(url: string): Promise<ChannelStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return "available";
    }
    return "unavailable";
  } catch {
    return "unavailable";
  }
}

export function useChannelStatusCheck(channel: Channel) {
  const setStatus = useChannelStore((state) => state.setStatus);
  const statusMap = useChannelStore((state) => state.statusMap);
  const isChecking = useRef(false);

  useEffect(() => {
    // Skip if already checked or checking
    if (checkedUrls.has(channel.url) || isChecking.current) {
      return;
    }

    // Skip if status already known
    if (statusMap[channel.id] && statusMap[channel.id] !== "unknown") {
      return;
    }

    isChecking.current = true;
    checkedUrls.add(channel.url);

    checkChannelStatus(channel.url).then((status) => {
      setStatus(channel.id, status);
      isChecking.current = false;
    });
  }, [channel.id, channel.url, setStatus, statusMap]);
}

export function useBatchChannelStatus(channels: Channel[]) {
  const setMultipleStatus = useChannelStore(
    (state) => state.setMultipleStatus
  );
  const statusMap = useChannelStore((state) => state.statusMap);

  useEffect(() => {
    const uncheckedChannels = channels.filter(
      (channel) =>
        !checkedUrls.has(channel.url) &&
        (!statusMap[channel.id] || statusMap[channel.id] === "unknown")
    );

    if (uncheckedChannels.length === 0) return;

    // Check channels in parallel with a limit
    const checkBatch = async (batch: Channel[]) => {
      const results: Record<string, ChannelStatus> = {};

      await Promise.all(
        batch.map(async (channel) => {
          checkedUrls.add(channel.url);
          const status = await checkChannelStatus(channel.url);
          results[channel.id] = status;
        })
      );

      setMultipleStatus(results);
    };

    // Check in batches of 5 to avoid overwhelming the network
    const batchSize = 5;
    const batches: Channel[][] = [];
    for (let i = 0; i < uncheckedChannels.length; i += batchSize) {
      batches.push(uncheckedChannels.slice(i, i + batchSize));
    }

    // Process batches sequentially
    let currentBatch = 0;
    const processNextBatch = () => {
      if (currentBatch < batches.length) {
        checkBatch(batches[currentBatch]).then(() => {
          currentBatch++;
          processNextBatch();
        });
      }
    };

    processNextBatch();
  }, [channels, setMultipleStatus, statusMap]);
}

export function clearStatusCache() {
  checkedUrls.clear();
}
