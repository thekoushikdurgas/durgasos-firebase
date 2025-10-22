import type { ComponentType } from 'react';
import { Briefcase, Globe, User, Store, Smile } from 'lucide-react';

import AboutMe from '@/components/apps/AboutMe';
import Portfolio from '@/components/apps/Portfolio';
import Browser from '@/components/apps/Browser';
import AppStore from '@/components/apps/AppStore';
import Welcome from '@/components/apps/Welcome';

export interface App {
  id: string;
  title: string;
  Icon: ComponentType<{ className?: string }>;
  Component: ComponentType;
  pinned?: boolean;
  desktop?: boolean;
  defaultSize?: {
    width: number;
    height: number;
  };
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
];
