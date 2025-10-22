'use client';

import { useDesktop } from '@/context/DesktopContext';
import { apps } from '@/lib/apps.config';
import { Search, Power, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function StartMenu() {
  const { isStartMenuOpen, setStartMenuOpen, openApp } = useDesktop();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  if (!isStartMenuOpen) return null;

  const pinnedApps = apps.filter(app => app.pinned);

  return (
    <div
      className="absolute bottom-14 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[600px] bg-neutral-800/50 backdrop-blur-2xl border border-white/20 rounded-lg shadow-2xl flex flex-col animate-start-menu-open"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Type here to search" className="pl-9 bg-neutral-700/80 border-neutral-600 focus:bg-neutral-600/80" />
        </div>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Pinned</h2>
          <Button variant="ghost" size="sm" className="text-xs">All apps &gt;</Button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {pinnedApps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                openApp(app.id);
                setStartMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-white/10 transition-colors gap-2"
            >
              <app.Icon className="w-8 h-8" />
              <span className="text-xs truncate">{app.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 mt-auto">
        <h2 className="text-sm font-semibold mb-4">Recommended</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer">
            <BriefcaseIcon className="w-8 h-8 text-blue-400" />
            <div>
              <p>Project Proposal.docx</p>
              <p className="text-xs text-gray-400">Recently added</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer">
            <ImageIcon className="w-8 h-8 text-green-400" />
            <div>
              <p>Product_Screenshots</p>
              <p className="text-xs text-gray-400">1h ago</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-auto bg-neutral-900/40 border-t border-white/10 px-6 py-3 flex justify-between items-center rounded-b-lg">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={userAvatar?.imageUrl} alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span>User</span>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="hover:bg-white/10">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/10">
            <Power className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}
