'use client';

import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useDesktop } from "@/context/DesktopContext";
import Image from "next/image";

export default function Welcome() {
  const { openApp, closeApp, windows } = useDesktop();
  const welcomeImage = PlaceHolderImages.find((p) => p.id === 'welcome-hero');

  const handleExplore = () => {
    openApp('portfolio');
    const welcomeWindow = windows.find(w => w.app.id === 'welcome');
    if (welcomeWindow) {
      closeApp(welcomeWindow.id);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-background text-foreground text-center">
      {welcomeImage && (
        <Image
          src={welcomeImage.imageUrl}
          alt={welcomeImage.description}
          width={300}
          height={180}
          className="rounded-lg mb-6"
          data-ai-hint={welcomeImage.imageHint}
        />
      )}
      <h1 className="text-4xl font-bold mb-2">Welcome to DurgasOS</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        This is a fully interactive Windows 11 desktop simulator built with Next.js and Tailwind CSS. Feel free to open apps, move windows, and explore the interface.
      </p>
      <div className="flex gap-4">
        <Button onClick={handleExplore}>Explore Portfolio</Button>
        <Button variant="secondary" onClick={() => openApp('about')}>About Me</Button>
      </div>
    </div>
  );
}
