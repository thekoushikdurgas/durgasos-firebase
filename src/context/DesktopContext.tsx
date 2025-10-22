'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { App } from '@/lib/apps.config';
import { useWindowStore } from '@/store/windowStore';

interface DesktopContextType {
  isStartMenuOpen: boolean;
  setStartMenuOpen: (isOpen: boolean) => void;
  openApp: (appId: string, data?: any) => void;
  closeApp: (id: string) => void;
  focusApp: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  windows: ReturnType<typeof useWindowStore>['windows'];
  updateWindow: (id: string, updates: Partial<ReturnType<typeof useWindowStore>['windows'][0]>) => void;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export const DesktopProvider = ({ children }: { children: ReactNode }) => {
  const {
    windows,
    openApp: openAppFromStore,
    closeApp,
    focusApp,
    toggleMinimize,
    toggleMaximize,
    updateWindow,
    isStartMenuOpen,
    setStartMenuOpen,
  } = useWindowStore();

  const openApp = (appId: string, data?: any) => {
    const appWindow = windows.find(w => w.app.id === appId && !w.data); // Only reuse if no new data
    if(appWindow) {
      if(appWindow.isMinimized) {
        toggleMinimize(appWindow.id);
      }
      focusApp(appWindow.id);
    } else {
      openAppFromStore(appId, data);
    }
  }

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
