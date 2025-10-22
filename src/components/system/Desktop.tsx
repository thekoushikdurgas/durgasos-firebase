'use client';

import { AppWindow } from '@/components/shared/AppWindow';
import { useDesktop } from '@/context/DesktopContext';
import { apps } from '@/lib/apps.config';
import { DesktopIcon } from '@/components/shared/DesktopIcon';
import Image from 'next/image';
import { useSettingsStore } from '@/store/settingsStore';
import { wallpapers } from '@/lib/wallpapers';

export function Desktop() {
  const { windows } = useDesktop();
  const { wallpaper: wallpaperId } = useSettingsStore();
  const wallpaper = wallpapers.find((p) => p.id === wallpaperId);
  const desktopApps = apps.filter(app => app.desktop);

  return (
    <div className="relative h-full w-full">
      {wallpaper && (
        <Image
          src={wallpaper.imageUrl}
          alt={wallpaper.description || 'Desktop wallpaper'}
          fill
          quality={100}
          className="object-cover"
          priority
          data-ai-hint={wallpaper.imageHint}
        />
      )}
      
      <div className="absolute top-5 left-5 grid grid-cols-1 gap-1">
        {desktopApps.map(app => (
            <DesktopIcon key={app.id} app={app} />
        ))}
      </div>

      {windows.map((win) => (
        <AppWindow
          key={win.id}
          id={win.id}
          app={win.app}
          data={win.data}
          zIndex={win.zIndex}
          isMinimized={win.isMinimized}
          isMaximized={win.isMaximized}
          position={win.position}
          size={win.size}
        />
      ))}
    </div>
  );
}
