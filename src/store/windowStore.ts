import { create } from 'zustand';
import type { App } from '@/lib/apps.config';
import { apps } from '@/lib/apps.config';

interface WindowInstance {
  id: string;
  app: App;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

interface WindowState {
  windows: WindowInstance[];
  nextZIndex: number;
  isStartMenuOpen: boolean;
  openApp: (appId: string) => void;
  closeApp: (id: string) => void;
  focusApp: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowInstance>) => void;
  setStartMenuOpen: (isOpen: boolean) => void;
}

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  nextZIndex: 10,
  isStartMenuOpen: false,
  setStartMenuOpen: (isOpen) => set({ isStartMenuOpen: isOpen }),
  openApp: (appId) => {
    const appConfig = apps.find((app) => app.id === appId);
    if (!appConfig) return;

    const { windows, nextZIndex } = get();

    const existingInstance = windows.find((w) => w.app.id === appId);
    if (existingInstance) {
      get().focusApp(existingInstance.id);
      if (existingInstance.isMinimized) {
        get().toggleMinimize(existingInstance.id);
      }
      return;
    }

    const newWindow: WindowInstance = {
      id: `${appId}-${Date.now()}`,
      app: appConfig,
      zIndex: nextZIndex,
      isMinimized: false,
      isMaximized: false,
      position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
      size: appConfig.defaultSize || { width: 640, height: 480 },
    };

    set({ windows: [...windows, newWindow], nextZIndex: nextZIndex + 1 });
  },
  closeApp: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },
  focusApp: (id) => {
    if (get().isStartMenuOpen) set({ isStartMenuOpen: false });
    const { nextZIndex } = get();
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex } : w
      ),
      nextZIndex: nextZIndex + 1,
    }));
  },
  toggleMinimize: (id) => {
    const { windows, nextZIndex } = get();
    const window = windows.find(w => w.id === id);
    if (!window) return;

    const isNowMinimized = !window.isMinimized;

    set({
      windows: windows.map((w) =>
        w.id === id
          ? { ...w, isMinimized: isNowMinimized, zIndex: isNowMinimized ? w.zIndex : nextZIndex }
          : w
      ),
      nextZIndex: isNowMinimized ? nextZIndex : nextZIndex + 1,
    });
  },
  toggleMaximize: (id) => {
    const { nextZIndex } = get();
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZIndex } : w
      ),
      nextZIndex: nextZIndex + 1,
    }));
  },
  updateWindow: (id, updates) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    }));
  },
}));
