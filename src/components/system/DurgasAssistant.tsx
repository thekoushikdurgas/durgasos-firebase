'use client';

import { useDurgasAssistant } from '@/hooks/use-durgas-assistant';
import { cn } from '@/lib/utils';

export default function DurgasAssistant() {
  const { isAssistantOpen, assistantState } = useDurgasAssistant();

  if (!isAssistantOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-48 h-48">
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-primary/20 animate-pulse',
            assistantState === 'listening' ? 'scale-110' : 'scale-100'
          )}
        />
        <div
          className={cn(
            'absolute inset-4 rounded-full bg-primary/40',
             assistantState === 'thinking' && 'animate-spin-slow'
          )}
        />
        <div className="absolute inset-8 rounded-full bg-primary" />
         <p className='absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-sm capitalize'>{assistantState}...</p>
      </div>
    </div>
  );
}
