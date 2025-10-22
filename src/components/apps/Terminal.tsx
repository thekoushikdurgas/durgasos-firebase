'use client';

import { useState, useRef, useEffect } from 'react';
import { mockFileSystem, type FileSystemItem } from '@/lib/filesystem';
import { cn } from '@/lib/utils';

type HistoryItem = {
  command: string;
  output: string | React.ReactNode;
};

const findItemByPath = (path: string[], fs: FileSystemItem[]): FileSystemItem | undefined => {
  if (path.length === 0) return undefined;
  
  let currentLevel = fs;
  let foundItem: FileSystemItem | undefined;

  for (const part of path) {
    if (part === 'C:') {
        foundItem = { id: 'C:', name: 'C:', type: 'folder', children: fs };
        continue;
    }
    if (!foundItem || foundItem.type !== 'folder' || !foundItem.children) return undefined;
    
    const nextItem = foundItem.children.find(item => item.name.toLowerCase() === part.toLowerCase());
    if (!nextItem) return undefined;

    foundItem = nextItem;
    if (nextItem.type === 'folder') {
        currentLevel = nextItem.children || [];
    }
  }

  return foundItem;
};


export default function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>(['C:', 'Users', 'Durgas']);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const executeCommand = (command: string) => {
    const [cmd, ...args] = command.trim().split(' ');
    let output: string | React.ReactNode = `command not found: ${cmd}`;

    const getCurrentDirectoryItems = () => {
      if (currentPath.length === 0) return [];
      if(currentPath.length === 1 && currentPath[0] === 'C:') return mockFileSystem;

      const parentPath = currentPath.slice(0, -1);
      const parentDir = findItemByPath(parentPath, mockFileSystem);
      
      if (parentDir && parentDir.type === 'folder' && parentDir.children) {
        const currentDir = parentDir.children.find(i => i.name.toLowerCase() === currentPath[currentPath.length-1].toLowerCase());
        return currentDir?.children || [];
      }
      return [];
    };

    switch (cmd.toLowerCase()) {
      case 'ls': {
        const items = getCurrentDirectoryItems();
        output = (
          <div className="grid grid-cols-4 gap-x-4">
            {items.map(item => (
              <span key={item.id} className={cn(item.type === 'folder' && 'text-blue-400')}>{item.name}</span>
            ))}
          </div>
        ) || ' ';
        break;
      }
      case 'cd': {
        const target = args[0];
        if (!target) {
            output = ' ';
            break;
        }
        if(target === '..') {
            if(currentPath.length > 1) {
                setCurrentPath(prev => prev.slice(0,-1));
            }
            output = ' ';
        } else {
            const newPath = [...currentPath, ...target.split(/[\\/]/)];
            const targetDir = findItemByPath(newPath, mockFileSystem);

            if(targetDir && targetDir.type === 'folder') {
                setCurrentPath(newPath);
                output = ' ';
            } else {
                output = `cd: no such file or directory: ${target}`;
            }
        }
        break;
      }
      case 'pwd':
        output = currentPath.join('\\');
        break;
      case 'cat': {
        const filePath = [...currentPath, ...args[0].split(/[\\/]/)];
        const file = findItemByPath(filePath, mockFileSystem);
        if (file && file.type === 'file') {
            output = file.content || `(file is empty)`;
        } else {
            output = `cat: ${args[0]}: No such file or directory`;
        }
        break;
      }
      case 'echo':
        output = args.join(' ');
        break;
      case 'clear':
        setHistory([]);
        return;
      case '':
        output = ' ';
        break;
    }

    setHistory(h => [...h, { command, output }]);
  };


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  return (
    <div
      className="h-full bg-black text-white font-mono text-sm p-2 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      <div>Welcome to DurgasOS Terminal!</div>
      {history.map((item, index) => (
        <div key={index}>
          <div className="flex">
            <span className="text-green-400">user@durgasos</span>
            <span className="mx-1">:</span>
            <span className="text-blue-400">~\{currentPath.join('\\')}</span>
            <span className="mx-1">$</span>
            <span>{item.command}</span>
          </div>
          <div>{item.output}</div>
        </div>
      ))}
      <form onSubmit={handleFormSubmit} className="flex">
        <span className="text-green-400">user@durgasos</span>
        <span className="mx-1">:</span>
        <span className="text-blue-400">~\{currentPath.join('\\')}</span>
        <span className="mx-1">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          className="bg-transparent border-none outline-none text-white flex-grow"
          autoComplete="off"
        />
      </form>
      <div ref={endOfHistoryRef} />
    </div>
  );
}
