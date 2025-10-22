'use client';

import type { App } from '@/lib/apps.config';
import { useDesktop } from '@/context/DesktopContext';

interface DesktopIconProps {
  app: App;
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const { openApp } = useDesktop();

  return (
    <button
      onDoubleClick={() => openApp(app.id)}
      className="flex flex-col items-center justify-center w-24 h-24 p-2 rounded-lg hover:bg-white/10 focus:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white/50 transition-colors"
      aria-label={`Open ${app.title}`}
    >
      <app.Icon className="w-8 h-8 drop-shadow-lg" />
      <span className="mt-2 text-xs text-white text-center truncate w-full shadow-black [text-shadow:0_1px_2px_var(--tw-shadow-color)]">
        {app.title}
      </span>
    </button>
  );
}
