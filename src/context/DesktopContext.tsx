'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import type { App } from '@/lib/apps.config';
import { useWindowStore } from '@/store/windowStore';

interface DesktopContextType {
  isStartMenuOpen: boolean;
  setStartMenuOpen: (isOpen: boolean) => void;
  openApp: (appId: string) => void;
  closeApp: (id: string) => void;
  focusApp: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  windows: ReturnType<typeof useWindowStore>['windows'];
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
    isStartMenuOpen,
    setStartMenuOpen,
  } = useWindowStore();

  useEffect(() => {
    // Open Welcome app on initial load
    openAppFromStore('welcome');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openApp = (appId: string) => {
    const appWindow = windows.find(w => w.app.id === appId);
    if(appWindow) {
      if(appWindow.isMinimized) {
        toggleMinimize(appWindow.id);
      }
      focusApp(appWindow.id);
    } else {
      openAppFromStore(appId);
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
