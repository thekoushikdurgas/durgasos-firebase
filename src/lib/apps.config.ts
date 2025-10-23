'use client';

import type { ComponentType } from 'react';
import { Briefcase, Globe, User, Store, Smile, Folder, Settings, Notebook, Terminal as TerminalIcon, Film, Wand2, MessageCircle, Mic } from 'lucide-react';

import AboutMe from '@/components/apps/AboutMe';
import Portfolio from '@/components/apps/Portfolio';
import Browser from '@/components/apps/Browser';
import AppStore from '@/components/apps/AppStore';
import Welcome from '@/components/apps/Welcome';
import FileExplorer from '@/components/apps/FileExplorer';
import SettingsApp from '@/components/apps/Settings';
import Notepad from '@/components/apps/Notepad';
import Terminal from '@/components/apps/Terminal';
import VideoPlayer from '@/components/apps/VideoPlayer';
import CreatorStudio from '@/components/apps/CreatorStudio';
import GeminiChat from '@/components/apps/GeminiChat';
import LiveAssistant from '@/components/apps/LiveAssistant';

export interface App {
  id: string;
  title: string;
  Icon: ComponentType<{ className?: string }>;
  Component: ComponentType<any>;
  pinned?: boolean;
  desktop?: boolean;
  defaultSize?: {
    width: number;
    height: number;
  };
  fileAssociation?: string; // e.g., '.txt'
}

export const apps: App[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    Icon: Smile,
    Component: Welcome,
    pinned: false,
    desktop: false,
    defaultSize: { width: 600, height: 450 },
  },
  {
    id: 'about',
    title: 'About Me',
    Icon: User,
    Component: AboutMe,
    pinned: true,
    desktop: true,
    defaultSize: { width: 500, height: 600 },
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    Icon: Briefcase,
    Component: Portfolio,
    pinned: true,
    desktop: true,
    defaultSize: { width: 900, height: 650 },
  },
  {
    id: 'explorer',
    title: 'File Explorer',
    Icon: Folder,
    Component: FileExplorer,
    pinned: true,
    desktop: true,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'browser',
    title: 'Browser',
    Icon: Globe,
    Component: Browser,
    pinned: true,
    desktop: false,
    defaultSize: { width: 1024, height: 768 },
  },
  {
    id: 'store',
    title: 'App Store',
    Icon: Store,
    Component: AppStore,
    pinned: true,
    desktop: false,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'settings',
    title: 'Settings',
    Icon: Settings,
    Component: SettingsApp,
    pinned: true,
    desktop: false,
    defaultSize: { width: 700, height: 550 },
  },
  {
    id: 'notepad',
    title: 'Notepad',
    Icon: Notebook,
    Component: Notepad,
    pinned: false,
    desktop: false,
    defaultSize: { width: 500, height: 400 },
    fileAssociation: '.txt',
  },
  {
    id: 'terminal',
    title: 'Terminal',
    Icon: TerminalIcon,
    Component: Terminal,
    pinned: true,
    desktop: true,
    defaultSize: { width: 640, height: 384 },
  },
  {
    id: 'video',
    title: 'Video Player',
    Icon: Film,
    Component: VideoPlayer,
    pinned: false,
    desktop: false,
    defaultSize: { width: 640, height: 480 },
    fileAssociation: '.mp4',
  },
  {
    id: 'creator-studio',
    title: 'Creator Studio',
    Icon: Wand2,
    Component: CreatorStudio,
    pinned: false,
    desktop: true,
    defaultSize: { width: 512, height: 720 },
  },
  {
    id: 'gemini-chat',
    title: 'Gemini Chat',
    Icon: MessageCircle,
    Component: GeminiChat,
    pinned: false,
    desktop: true,
    defaultSize: { width: 540, height: 720 },
  },
  {
    id: 'live-assistant',
    title: 'Live Assistant',
    Icon: Mic,
    Component: LiveAssistant,
    pinned: false,
    desktop: true,
    defaultSize: { width: 500, height: 640 },
  }
];
