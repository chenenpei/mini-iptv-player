import type { Channel } from "@/types/channel";
import { zustandStorage } from "@services/storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoriteState {
  favorites: Channel[];
  addFavorite: (channel: Channel) => void;
  removeFavorite: (channelId: string) => void;
  isFavorite: (channelId: string) => boolean;
  toggleFavorite: (channel: Channel) => void;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (channel) =>
        set((state) => {
          if (state.favorites.some((c) => c.id === channel.id)) {
            return state;
          }
          return { favorites: [...state.favorites, channel] };
        }),

      removeFavorite: (channelId) =>
        set((state) => ({
          favorites: state.favorites.filter((c) => c.id !== channelId),
        })),

      isFavorite: (channelId) =>
        get().favorites.some((c) => c.id === channelId),

      toggleFavorite: (channel) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(channel.id)) {
          removeFavorite(channel.id);
        } else {
          addFavorite(channel);
        }
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "favorite-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
