'use client';

import { Wifi, Volume2, Battery } from 'lucide-react';
import { useLocalTime } from '@/hooks/use-local-time';

export function SystemTray() {
  const { time, date } = useLocalTime();

  return (
    <div className="flex items-center justify-end h-full px-2">
      <div className="flex items-center gap-3 mr-4">
        <Wifi size={16} />
        <Volume2 size={16} />
        <div className="flex items-center gap-1">
          <Battery size={16} />
          <span>98%</span>
        </div>
      </div>
      <div className="text-xs text-right leading-tight">
        <div>{time}</div>
        <div>{date}</div>
      </div>
    </div>
  );
}
