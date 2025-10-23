'use client';

import { useState, useEffect } from 'react';
import { BootScreen } from '@/components/system/BootScreen';
import { Desktop } from '@/components/system/Desktop';
import { Taskbar } from '@/components/system/Taskbar';

export default function Home() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
    }, 3000); // Simulate a 3-second boot time

    return () => clearTimeout(timer);
  }, []);

  if (booting) {
    return <BootScreen />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black select-none">
      <Desktop />
      <Taskbar />
    </div>
  );
}
