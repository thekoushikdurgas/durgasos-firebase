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
  data?: any; // To pass props to app components
}

interface WindowState {
  windows: WindowInstance[];
  nextZIndex: number;
  isStartMenuOpen: boolean;
  openApp: (appId: string, data?: any) => void;
  closeApp: (id: string) => void;
  focusApp: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowInstance>) => void;
  setStartMenuOpen: (isOpen: boolean) => void;
}

const useWindowStore = create<WindowState>((set, get) => ({
    windows: [],
    nextZIndex: 10,
    isStartMenuOpen: false,
    setStartMenuOpen: (isOpen: boolean) => set({ isStartMenuOpen: isOpen }),
    openApp: (appId: string, data?: any) => {
        const appConfig = apps.find((app) => app.id === appId);
        if (!appConfig) return;

        const { windows, nextZIndex } = get();
        
        // If opening with data, always create a new window
        // If not, and a window for that app exists, focus it.
        if (!data) {
            const existingInstance = windows.find((w) => w.app.id === appId);
            if (existingInstance) {
                get().focusApp(existingInstance.id);
                if (existingInstance.isMinimized) {
                    get().toggleMinimize(existingInstance.id);
                }
                return;
            }
        }
        
        const newWindow: WindowInstance = {
            id: `${appId}-${Date.now()}`,
            app: appConfig,
            zIndex: nextZIndex,
            isMinimized: false,
            isMaximized: false,
            position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
            size: appConfig.defaultSize || { width: 640, height: 480 },
            data,
        };

        set({ windows: [...windows, newWindow], nextZIndex: nextZIndex + 1 });
    },
    closeApp: (id: string) => {
        set((state) => ({
        windows: state.windows.filter((w) => w.id !== id),
        }));
    },
    focusApp: (id: string) => {
        if (get().isStartMenuOpen) set({ isStartMenuOpen: false });
        const { nextZIndex } = get();
        set((state) => ({
        windows: state.windows.map((w) =>
            w.id === id ? { ...w, zIndex: nextZIndex } : w
        ),
        nextZIndex: nextZIndex + 1,
        }));
    },
    toggleMinimize: (id: string) => {
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
    toggleMaximize: (id: string) => {
        const { nextZIndex } = get();
        set((state) => ({
        windows: state.windows.map((w) =>
            w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZIndex } : w
        ),
        nextZIndex: nextZIndex + 1,
        }));
    },
    updateWindow: (id: string, updates: Partial<WindowInstance>) => {
        set((state) => ({
        windows: state.windows.map((w) =>
            w.id === id ? { ...w, ...updates } : w
        ),
        }));
    },
}));

// Open Welcome app on initial load, but only on client
if (typeof window !== 'undefined') {
    useWindowStore.getState().openApp('welcome');
}

export { useWindowStore };
