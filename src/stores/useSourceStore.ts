import { zustandStorage } from "@services/storage";
import type { Source } from "@/types/source";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const DEFAULT_SOURCE: Source = {
  id: "default",
  name: "中国频道",
  url: "https://iptv-org.github.io/iptv/countries/cn.m3u",
  enabled: true,
  isDefault: true,
};

interface SourceState {
  sources: Source[];
  addSource: (source: Omit<Source, "id">) => void;
  updateSource: (id: string, data: Partial<Source>) => void;
  removeSource: (id: string) => void;
  toggleSource: (id: string) => void;
  getEnabledSources: () => Source[];
}

export const useSourceStore = create<SourceState>()(
  persist(
    (set, get) => ({
      sources: [DEFAULT_SOURCE],
      addSource: (source) =>
        set((state) => ({
          sources: [
            ...state.sources,
            {
              ...source,
              id: `source_${Date.now()}`,
            },
          ],
        })),
      updateSource: (id, data) =>
        set((state) => ({
          sources: state.sources.map((source) =>
            source.id === id ? { ...source, ...data } : source
          ),
        })),
      removeSource: (id) =>
        set((state) => ({
          sources: state.sources.filter(
            (source) => source.id !== id || source.isDefault
          ),
        })),
      toggleSource: (id) =>
        set((state) => ({
          sources: state.sources.map((source) =>
            source.id === id ? { ...source, enabled: !source.enabled } : source
          ),
        })),
      getEnabledSources: () => get().sources.filter((source) => source.enabled),
    }),
    {
      name: "source-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
