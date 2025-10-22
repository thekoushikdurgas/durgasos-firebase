'use client';

import { Rnd } from 'react-rnd';
import { useDesktop } from '@/context/DesktopContext';
import { X, Square, Minus, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { App } from '@/lib/apps.config';

interface AppWindowProps {
  id: string;
  app: App;
  data?: any;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

export function AppWindow({ id, app, data, zIndex, isMinimized, isMaximized, position, size }: AppWindowProps) {
  const { closeApp, focusApp, toggleMinimize, toggleMaximize, updateWindow } = useDesktop();

  if (isMinimized) {
    return null;
  }

  const handleDragStop = (_e: any, d: { x: any; y: any; }) => {
    updateWindow(id, { position: { x: d.x, y: d.y } });
  };

  const handleResizeStop = (_e: any, _dir: any, ref: { style: { width: any; height: any; }; }, _delta: any, position: any) => {
    updateWindow(id, {
      size: { width: ref.style.width, height: ref.style.height },
      position,
    });
  };

  return (
    <Rnd
      size={isMaximized ? { width: '100%', height: 'calc(100% - 48px)' } : size}
      position={isMaximized ? { x: 0, y: 0 } : position}
      onDragStart={() => focusApp(id)}
      onDragStop={handleDragStop}
      onResizeStart={() => focusApp(id)}
      onResizeStop={handleResizeStop}
      minWidth={300}
      minHeight={200}
      dragHandleClassName="handle"
      className={cn('transition-all duration-200 ease-in-out', isMaximized ? '' : 'rounded-lg overflow-hidden')}
      style={{ zIndex }}
      bounds="parent"
      enableResizing={!isMaximized}
    >
      <div
        onMouseDown={() => focusApp(id)}
        className={cn(
          'w-full h-full flex flex-col bg-background border border-white/20 shadow-2xl',
          isMaximized ? '' : 'rounded-lg'
        )}
      >
        <header className="handle h-8 flex items-center justify-between pl-2 bg-secondary/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <app.Icon className="w-4 h-4 text-foreground" />
            <span className="text-xs">{app.title}</span>
          </div>
          <div className="flex items-center h-full">
            <button onClick={() => toggleMinimize(id)} className="h-full px-3 text-foreground hover:bg-white/10 transition-colors">
              <Minus size={16} />
            </button>
            <button onClick={() => toggleMaximize(id)} className="h-full px-3 text-foreground hover:bg-white/10 transition-colors">
              {isMaximized ? <Copy size={14} /> : <Square size={14} />}
            </button>
            <button onClick={() => closeApp(id)} className="h-full px-3 text-foreground hover:bg-red-500 transition-colors">
              <X size={16} />
            </button>
          </div>
        </header>
        <main className="flex-grow overflow-auto">
          <app.Component data={data} />
        </main>
      </div>
    </Rnd>
  );
}
