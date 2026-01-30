import type { ChannelStatus } from "@/types/channel";
import { create } from "zustand";

interface ChannelState {
  // Status tracking
  statusMap: Record<string, ChannelStatus>;
  setStatus: (channelId: string, status: ChannelStatus) => void;
  setMultipleStatus: (statuses: Record<string, ChannelStatus>) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Collapsed groups
  collapsedGroups: Set<string>;
  toggleGroupCollapsed: (groupName: string) => void;
  isGroupCollapsed: (groupName: string) => boolean;
}

export const useChannelStore = create<ChannelState>((set, get) => ({
  // Status
  statusMap: {},
  setStatus: (channelId, status) =>
    set((state) => ({
      statusMap: { ...state.statusMap, [channelId]: status },
    })),
  setMultipleStatus: (statuses) =>
    set((state) => ({
      statusMap: { ...state.statusMap, ...statuses },
    })),

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Collapsed groups
  collapsedGroups: new Set<string>(),
  toggleGroupCollapsed: (groupName) =>
    set((state) => {
      const newCollapsed = new Set(state.collapsedGroups);
      if (newCollapsed.has(groupName)) {
        newCollapsed.delete(groupName);
      } else {
        newCollapsed.add(groupName);
      }
      return { collapsedGroups: newCollapsed };
    }),
  isGroupCollapsed: (groupName) => get().collapsedGroups.has(groupName),
}));
