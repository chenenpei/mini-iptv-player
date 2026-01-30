import { useQuery } from "@tanstack/react-query";
import { useSourceStore } from "@stores/useSourceStore";
import {
  fetchChannelsFromSources,
  groupChannels,
  filterChannels,
} from "@services/channelService";
import { useChannelStore } from "@stores/useChannelStore";
import { useMemo } from "react";
import type { Channel, ChannelGroup } from "@/types/channel";

export function useChannels() {
  const sources = useSourceStore((state) => state.sources);
  const enabledSources = sources.filter((s) => s.enabled);
  const searchQuery = useChannelStore((state) => state.searchQuery);

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

  const groupedChannels = useMemo(() => {
    return groupChannels(filteredChannels);
  }, [filteredChannels]);

  return {
    channels: filteredChannels,
    groupedChannels,
    allChannels: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

export function useChannelById(channelId: string): Channel | undefined {
  const { allChannels } = useChannels();
  return allChannels.find((channel) => channel.id === channelId);
}
