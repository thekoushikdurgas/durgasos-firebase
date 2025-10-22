'use client';

import { useDesktop } from '@/context/DesktopContext';
import { apps } from '@/lib/apps.config';
import { WindowsLogo } from './WindowsLogo';
import { SystemTray } from './SystemTray';
import { StartMenu } from './StartMenu';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Taskbar() {
  const { windows, isStartMenuOpen, setStartMenuOpen, focusApp, toggleMinimize } = useDesktop();
  const pinnedApps = apps.filter(app => app.pinned);

  const handleAppClick = (appId: string) => {
    const openWindow = windows.find(w => w.app.id === appId);
    if(openWindow) {
      if(openWindow.isMinimized) {
        toggleMinimize(openWindow.id);
      } else {
        focusApp(openWindow.id);
      }
    } else {
       // This case should be handled by openApp in context, but just in case
    }
  }


  return (
    <>
      {isStartMenuOpen && <div className="fixed inset-0" onClick={() => setStartMenuOpen(false)} />}
      <StartMenu />
      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-neutral-800/50 backdrop-blur-2xl border-t border-white/20 flex justify-center items-center z-50">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "p-3 rounded-md transition-colors",
                    isStartMenuOpen ? "bg-primary" : "hover:bg-white/20"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStartMenuOpen(!isStartMenuOpen);
                  }}
                  aria-label="Start Menu"
                >
                  <WindowsLogo className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {pinnedApps.map((app) => {
            const isOpen = windows.some((w) => w.app.id === app.id && !w.isMinimized);
            const isMinimized = windows.some((w) => w.app.id === app.id && w.isMinimized);
            
            return (
              <TooltipProvider key={app.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleAppClick(app.id)}
                      onDoubleClick={() => useDesktop().openApp(app.id)}
                      className="relative p-3 rounded-md hover:bg-white/20"
                    >
                      <app.Icon className="w-6 h-6" />
                      {(isOpen || isMinimized) && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{app.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
        <div className="absolute right-0 top-0 h-full">
          <SystemTray />
        </div>
      </footer>
    </>
  );
}
