'use client';

import { useState } from 'react';
import { mockFileSystem, type FileSystemItem } from '@/lib/filesystem';
import { apps } from '@/lib/apps.config';
import { useDesktop } from '@/context/DesktopContext';
import { Folder, File, ChevronRight, List, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState<string[]>(['C:', 'Users', 'Durgas']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { openApp } = useDesktop();

  const getCurrentItems = () => {
    let items: FileSystemItem[] = mockFileSystem;
    for (const part of currentPath) {
      const folder = items.find(item => item.name === part && item.type === 'folder');
      if (folder && folder.children) {
        items = folder.children;
      } else if (part !== 'C:') {
        return [];
      }
    }
    return items;
  };
  
  const currentItems = getCurrentItems();

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
    } else {
      const fileExtension = '.' + item.name.split('.').pop();
      const appToOpen = apps.find(app => app.fileAssociation === fileExtension);
      
      if (appToOpen) {
        openApp(appToOpen.id, { content: item.content, fileName: item.name });
      } else {
        console.log(`No application associated with ${fileExtension} files.`);
        // Optionally, open a dialog or a default text viewer
      }
    }
  };
  
  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };
  
  const getIcon = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      return <Folder className="w-12 h-12 text-yellow-500" />;
    }
    // Basic file type detection
    if (item.name.endsWith('.txt')) return <File className="w-12 h-12 text-gray-400" />;
    if (item.name.endsWith('.jpg') || item.name.endsWith('.png')) return <File className="w-12 h-12 text-blue-400" />;
    if (item.name.endsWith('.pdf')) return <File className="w-12 h-12 text-red-400" />;
    return <File className="w-12 h-12 text-gray-400" />;
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <header className="flex items-center gap-2 p-2 bg-secondary/50 border-b border-border flex-shrink-0">
        <div className="flex items-center text-sm">
          {currentPath.map((part, index) => (
            <div key={index} className="flex items-center">
              <button onClick={() => handleBreadcrumbClick(index)} className="px-2 py-1 hover:bg-black/10 rounded-sm">
                {part}
              </button>
              {index < currentPath.length -1 && <ChevronRight size={16} className="text-muted-foreground" />}
            </div>
          ))}
        </div>
        <div className='flex-grow' />
        <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
          <List size={16} />
        </Button>
        <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
          <Grid size={16} />
        </Button>
      </header>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className={cn(
          "w-full",
          viewMode === 'grid' ? 'grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4' : 'flex flex-col gap-1'
        )}>
          {currentItems.map((item) => (
            <button
              key={item.id}
              onDoubleClick={() => handleItemClick(item)}
              className={cn(
                "p-2 rounded-md hover:bg-primary/10 focus:bg-primary/20 focus:outline-none flex items-center gap-2 text-left",
                viewMode === 'grid' && 'flex-col justify-center h-28'
              )}
            >
              {getIcon(item)}
              <span className="text-xs truncate w-full text-center">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
      <footer className="p-2 border-t border-border text-xs text-muted-foreground">
        {currentItems.length} items
      </footer>
    </div>
  );
}
