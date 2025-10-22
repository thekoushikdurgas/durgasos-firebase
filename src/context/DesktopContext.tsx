'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

interface DesktopContextType {
  windows: WindowInstance[];
  openApp: (appId: string) => void;
  closeApp: (id: string) => void;
  focusApp: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowInstance>) => void;
  isStartMenuOpen: boolean;
  setStartMenuOpen: (isOpen: boolean) => void;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export const DesktopProvider = ({ children }: { children: ReactNode }) => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);

  useEffect(() => {
    // Open Welcome app on initial load
    openApp('welcome');
  }, []);

  const openApp = (appId: string) => {
    const appConfig = apps.find((app) => app.id === appId);
    if (!appConfig) return;

    const existingInstance = windows.find((w) => w.app.id === appId);
    if (existingInstance) {
      focusApp(existingInstance.id);
      if (existingInstance.isMinimized) {
        toggleMinimize(existingInstance.id);
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

    setWindows([...windows, newWindow]);
    setNextZIndex(nextZIndex + 1);
  };

  const closeApp = (id: string) => {
    setWindows(windows.filter((w) => w.id !== id));
  };

  const focusApp = (id: string) => {
    if (isStartMenuOpen) setStartMenuOpen(false);
    
    setWindows(
      windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex } : w
      )
    );
    setNextZIndex(nextZIndex + 1);
  };

  const toggleMinimize = (id: string) => {
    setWindows(
      windows.map((w) => {
        if (w.id === id) {
          const isNowMinimized = !w.isMinimized;
          return { ...w, isMinimized: isNowMinimized, zIndex: isNowMinimized ? w.zIndex : nextZIndex };
        }
        return w;
      })
    );
     if (!windows.find(w => w.id === id)?.isMinimized) {
        setNextZIndex(nextZIndex + 1);
     }
  };
  
  const toggleMaximize = (id: string) => {
    setWindows(
      windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZIndex } : w
      )
    );
    setNextZIndex(nextZIndex + 1);
  };

  const updateWindow = (id: string, updates: Partial<WindowInstance>) => {
    setWindows(windows.map(w => w.id === id ? { ...w, ...updates } : w));
  };


  return (
    <DesktopContext.Provider
      value={{
        windows,
        openApp,
        closeApp,
        focusApp,
        toggleMinimize,
        toggleMaximize,
        updateWindow,
        isStartMenuOpen,
        setStartMenuOpen,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = (): DesktopContextType => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};
