import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';
export type AccentColor = 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'red';

interface SettingsState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  wallpaper: string;
  setWallpaper: (wallpaperId: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      accent: 'blue',
      setAccent: (accent) => set({ accent }),
      wallpaper: 'desktop-wallpaper',
      setWallpaper: (wallpaperId) => set({ wallpaper: wallpaperId }),
    }),
    {
      name: 'durgas-os-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
