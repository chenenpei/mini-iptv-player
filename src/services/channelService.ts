import type { Channel, ChannelGroup } from "@/types/channel";
import type { Source } from "@/types/source";
import { parseM3U } from "./m3uParser";

export async function fetchChannelsFromSource(
  source: Source
): Promise<Channel[]> {
  const response = await fetch(source.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.name}: ${response.statusText}`);
  }
  const content = await response.text();
  const result = parseM3U(content);
  return result.channels;
}

export async function fetchChannelsFromSources(
  sources: Source[]
): Promise<Channel[]> {
  const results = await Promise.allSettled(
    sources.map((source) => fetchChannelsFromSource(source))
  );

  const channels: Channel[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      channels.push(...result.value);
    }
  }

  return channels;
}

export function groupChannels(channels: Channel[]): ChannelGroup[] {
  const groupMap = new Map<string, Channel[]>();

  for (const channel of channels) {
    const group = channel.group || "Other";
    if (!groupMap.has(group)) {
      groupMap.set(group, []);
    }
    groupMap.get(group)!.push(channel);
  }

  // Sort groups alphabetically, but keep "Other" at the end
  const sortedGroups = Array.from(groupMap.keys()).sort((a, b) => {
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return a.localeCompare(b, "zh-CN");
  });

  return sortedGroups.map((name) => ({
    name,
    channels: groupMap.get(name)!,
  }));
}

export function filterChannels(
  channels: Channel[],
  searchQuery: string
): Channel[] {
  if (!searchQuery.trim()) {
    return channels;
  }

  const query = searchQuery.toLowerCase().trim();
  return channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(query) ||
      channel.group.toLowerCase().includes(query) ||
      channel.tvgName?.toLowerCase().includes(query)
  );
}

export function sortChannels(
  channels: Channel[],
  sortBy: "name" | "group"
): Channel[] {
  return [...channels].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name, "zh-CN");
    }
    // Sort by group first, then by name
    const groupCompare = a.group.localeCompare(b.group, "zh-CN");
    if (groupCompare !== 0) return groupCompare;
    return a.name.localeCompare(b.name, "zh-CN");
  });
}
