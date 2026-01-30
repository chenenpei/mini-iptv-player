import type { ChannelStatus } from "@/types/channel";
import { create } from "zustand";

export type SortBy = "name" | "status";
export type LayoutMode = "list" | "grid";

interface ChannelState {
  // Status tracking
  statusMap: Record<string, ChannelStatus>;
  setStatus: (channelId: string, status: ChannelStatus) => void;
  setMultipleStatus: (statuses: Record<string, ChannelStatus>) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Sort
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;

  // Layout
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;

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

  // Sort
  sortBy: "name",
  setSortBy: (sortBy) => set({ sortBy }),

  // Layout
  layoutMode: "list",
  setLayoutMode: (mode) => set({ layoutMode: mode }),

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
