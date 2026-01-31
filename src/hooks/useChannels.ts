import { useQuery } from "@tanstack/react-query";
import { useSourceStore } from "@stores/useSourceStore";
import {
  fetchChannelsFromSources,
  groupChannels,
  filterChannels,
} from "@services/channelService";
import { useChannelStore } from "@stores/useChannelStore";
import { useMemo, useDeferredValue } from "react";
import type { Channel, ChannelStatus } from "@/types/channel";

// Pre-create collator for much faster sorting (10x+ faster than localeCompare)
const zhCollator = new Intl.Collator("zh-CN");

function sortChannelsByStatus(
  channels: Channel[],
  statusMap: Record<string, ChannelStatus>
): Channel[] {
  const statusOrder: Record<ChannelStatus, number> = {
    available: 0,
    unknown: 1,
    unavailable: 2,
  };

  return [...channels].sort((a, b) => {
    const statusA = statusMap[a.id] ?? "unknown";
    const statusB = statusMap[b.id] ?? "unknown";
    const orderDiff = statusOrder[statusA] - statusOrder[statusB];
    if (orderDiff !== 0) return orderDiff;
    return zhCollator.compare(a.name, b.name);
  });
}

function sortChannelsByName(channels: Channel[]): Channel[] {
  return [...channels].sort((a, b) => zhCollator.compare(a.name, b.name));
}

export function useChannels() {
  const sources = useSourceStore((state) => state.sources);
  const enabledSources = sources.filter((s) => s.enabled);
  const searchQuery = useChannelStore((state) => state.searchQuery);
  const sortBy = useChannelStore((state) => state.sortBy);
  const statusMap = useChannelStore((state) => state.statusMap);

  // Defer statusMap changes to avoid blocking UI during rapid updates
  const deferredStatusMap = useDeferredValue(statusMap);

  const query = useQuery({
    queryKey: ["channels", enabledSources.map((s) => s.id)],
    queryFn: () => fetchChannelsFromSources(enabledSources),
    enabled: enabledSources.length > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const filteredChannels = useMemo(() => {
    if (!query.data) return [];
    return filterChannels(query.data, searchQuery);
  }, [query.data, searchQuery]);

  // Only use statusMap as dependency when sorting by status
  const sortedChannels = useMemo(() => {
    if (sortBy === "status") {
      return sortChannelsByStatus(filteredChannels, deferredStatusMap);
    }
    return sortChannelsByName(filteredChannels);
  }, [filteredChannels, sortBy, deferredStatusMap]);

  const groupedChannels = useMemo(() => {
    return groupChannels(sortedChannels);
  }, [sortedChannels]);

  return {
    channels: sortedChannels,
    groupedChannels,
    allChannels: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

// Lightweight hook for player - no sorting to avoid expensive computation
export function useChannelsForPlayer() {
  const sources = useSourceStore((state) => state.sources);
  const enabledSources = sources.filter((s) => s.enabled);

  const query = useQuery({
    queryKey: ["channels", enabledSources.map((s) => s.id)],
    queryFn: () => fetchChannelsFromSources(enabledSources),
    enabled: enabledSources.length > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Return raw data without sorting (sorting is expensive with localeCompare)
  return { channels: query.data ?? [] };
}

// Lightweight hook to get a single channel by ID (no sorting needed)
export function useChannelById(channelId: string): Channel | undefined {
  const sources = useSourceStore((state) => state.sources);
  const enabledSources = sources.filter((s) => s.enabled);

  const query = useQuery({
    queryKey: ["channels", enabledSources.map((s) => s.id)],
    queryFn: () => fetchChannelsFromSources(enabledSources),
    enabled: enabledSources.length > 0,
    staleTime: 1000 * 60 * 10,
  });

  // Direct lookup without sorting
  return query.data?.find((channel) => channel.id === channelId);
}
