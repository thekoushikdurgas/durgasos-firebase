'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { useSettingsStore } from '@/store/settingsStore';
import { useEffect } from 'react';
import DurgasAssistant from '@/components/system/DurgasAssistant';
import { DurgasAssistantProvider } from '@/hooks/use-durgas-assistant';
import { DesktopProvider } from '@/context/DesktopContext';

// This is a client component because it uses hooks to update the theme
const metadata: Metadata = {
  title: 'DurgasOS',
  description: 'A Windows 11 desktop simulator built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, accent } = useSettingsStore();

  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.setAttribute('data-accent', accent);
  }, [theme, accent]);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <DesktopProvider>
          <DurgasAssistantProvider>
            {children}
            <DurgasAssistant />
            <Toaster />
          </DurgasAssistantProvider>
        </DesktopProvider>
      </body>
    </html>
  );
}
