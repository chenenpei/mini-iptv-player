import type { Channel } from "@/types/channel";
import { zustandStorage } from "@services/storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_HISTORY_RECORDS = 100;

export interface HistoryRecord {
  channel: Channel;
  watchedAt: number;
}

interface HistoryState {
  history: HistoryRecord[];
  addHistory: (channel: Channel) => void;
  removeHistory: (channelId: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],

      addHistory: (channel) =>
        set((state) => {
          const now = Date.now();
          // Remove existing record for this channel
          const filtered = state.history.filter(
            (r) => r.channel.id !== channel.id
          );
          // Add new record at the beginning
          const newHistory = [{ channel, watchedAt: now }, ...filtered];
          // Limit to max records
          return {
            history: newHistory.slice(0, MAX_HISTORY_RECORDS),
          };
        }),

      removeHistory: (channelId) =>
        set((state) => ({
          history: state.history.filter((r) => r.channel.id !== channelId),
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "history-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
