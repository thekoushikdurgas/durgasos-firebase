'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AppWindow } from '@/components/shared/AppWindow';
import { useDesktop } from '@/context/DesktopContext';
import { apps } from '@/lib/apps.config';
import { DesktopIcon } from '@/components/shared/DesktopIcon';
import Image from 'next/image';

export function Desktop() {
  const { windows } = useDesktop();
  const wallpaper = PlaceHolderImages.find((p) => p.id === 'desktop-wallpaper');
  const desktopApps = apps.filter(app => app.desktop);

  return (
    <div className="relative h-full w-full">
      {wallpaper && (
        <Image
          src={wallpaper.imageUrl}
          alt={wallpaper.description}
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
