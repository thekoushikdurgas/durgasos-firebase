'use client';

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSettingsStore, type AccentColor } from "@/store/settingsStore";
import { cn } from "@/lib/utils";
import { wallpapers } from "@/lib/wallpapers";
import Image from "next/image";
import { Check } from "lucide-react";

const accentColors: { name: AccentColor; color: string }[] = [
  { name: 'blue', color: 'hsl(207 100% 42%)' },
  { name: 'green', color: 'hsl(142 71% 45%)' },
  { name: 'orange', color: 'hsl(25 95% 53%)' },
  { name: 'pink', color: 'hsl(322 84% 54%)' },
  { name: 'purple', color: 'hsl(262 84% 57%)' },
  { name: 'red', color: 'hsl(0 84% 60%)' },
];

export default function Settings() {
  const { theme, setTheme, accent, setAccent, wallpaper, setWallpaper } = useSettingsStore();

  return (
    <div className="h-full p-6 text-foreground bg-background overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Personalization</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Theme</h2>
        <RadioGroup value={theme} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Dark</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Accent Color</h2>
        <div className="flex flex-wrap gap-3">
          {accentColors.map(({ name, color }) => (
            <button
              key={name}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                accent === name ? "border-ring" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setAccent(name)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Wallpaper</h2>
        <div className="grid grid-cols-3 gap-4">
          {wallpapers.map((wp) => (
            <button key={wp.id} className="relative aspect-video rounded-md overflow-hidden group" onClick={() => setWallpaper(wp.id)}>
              <Image src={wp.imageUrl} alt={wp.id} fill className="object-cover" />
              {wallpaper === wp.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              )}
               <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
