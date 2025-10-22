'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search } from "lucide-react";
import Image from "next/image";

const storeApps = [
  { name: 'Photo Editor Pro', category: 'Productivity', image: PlaceHolderImages.find(p => p.id === 'app-store-1') },
  { name: 'Music Stream', category: 'Entertainment', image: PlaceHolderImages.find(p => p.id === 'app-store-2') },
  { name: 'CodePad', category: 'Developer Tools', image: PlaceHolderImages.find(p => p.id === 'app-store-3') },
  { name: 'Weather Now', category: 'Utilities', image: PlaceHolderImages.find(p => p.id === 'app-store-4') },
];

export default function AppStore() {
  return (
    <div className="h-full p-6 text-foreground bg-background overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">App Store</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search apps" className="pl-9 bg-secondary/50" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {storeApps.map((app, index) => (
          <Card key={index} className="bg-secondary/50 border-white/10">
            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
              {app.image &&
                <Image src={app.image.imageUrl} alt={app.name} width={64} height={64} className="rounded-lg" data-ai-hint={app.image.imageHint} />
              }
              <div>
                <h3 className="font-semibold">{app.name}</h3>
                <p className="text-sm text-muted-foreground">{app.category}</p>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full mt-4">Get</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
