import type { Channel } from "@/types/channel";

export interface M3UParserResult {
  channels: Channel[];
  groups: string[];
}

function generateChannelId(url: string, tvgId?: string): string {
  if (tvgId) {
    return tvgId;
  }
  // Simple hash for URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `channel_${Math.abs(hash).toString(16)}`;
}

function parseExtInfAttributes(line: string): {
  tvgId?: string;
  tvgName?: string;
  tvgLogo?: string;
  groupTitle: string;
  channelName: string;
} {
  const result = {
    tvgId: undefined as string | undefined,
    tvgName: undefined as string | undefined,
    tvgLogo: undefined as string | undefined,
    groupTitle: "Other",
    channelName: "",
  };

  // Extract attributes using regex
  const tvgIdMatch = line.match(/tvg-id="([^"]*)"/i);
  const tvgNameMatch = line.match(/tvg-name="([^"]*)"/i);
  const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/i);
  const groupTitleMatch = line.match(/group-title="([^"]*)"/i);

  if (tvgIdMatch?.[1]) {
    result.tvgId = tvgIdMatch[1];
  }
  if (tvgNameMatch?.[1]) {
    result.tvgName = tvgNameMatch[1];
  }
  if (tvgLogoMatch?.[1]) {
    result.tvgLogo = tvgLogoMatch[1];
  }
  if (groupTitleMatch?.[1]) {
    result.groupTitle = groupTitleMatch[1];
  }

  // Extract channel name (after the last comma)
  const commaIndex = line.lastIndexOf(",");
  if (commaIndex !== -1) {
    result.channelName = line.substring(commaIndex + 1).trim();
  }

  return result;
}

export function parseM3U(content: string): M3UParserResult {
  const lines = content.split(/\r?\n/);
  const channels: Channel[] = [];
  const groupsSet = new Set<string>();

  let currentExtInf: ReturnType<typeof parseExtInfAttributes> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      continue;
    }

    // Skip the M3U header
    if (line.startsWith("#EXTM3U")) {
      continue;
    }

    // Parse EXTINF line
    if (line.startsWith("#EXTINF:")) {
      currentExtInf = parseExtInfAttributes(line);
      continue;
    }

    // Skip other comments
    if (line.startsWith("#")) {
      continue;
    }

    // This should be a URL line
    if (currentExtInf && (line.startsWith("http://") || line.startsWith("https://"))) {
      const channel: Channel = {
        id: generateChannelId(line, currentExtInf.tvgId),
        name: currentExtInf.channelName || currentExtInf.tvgName || "Unknown",
        url: line,
        logo: currentExtInf.tvgLogo,
        group: currentExtInf.groupTitle,
        tvgId: currentExtInf.tvgId,
        tvgName: currentExtInf.tvgName,
      };

      channels.push(channel);
      groupsSet.add(channel.group);
      currentExtInf = null;
    }
  }

  return {
    channels,
    groups: Array.from(groupsSet).sort(),
  };
}
