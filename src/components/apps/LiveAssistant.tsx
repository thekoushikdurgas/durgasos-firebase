'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { liveAssistant } from '@/ai/flows/live-assistant-flow';
import { Mic, MicOff, Bot, User, Loader2, Circle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type TranscriptionPart = {
  text: string;
  source: 'user' | 'model';
  final: boolean;
};

export default function LiveAssistant() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionPart[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const startConnection = async () => {
    setIsConnecting(true);
    setTranscription([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      const live = await liveAssistant();

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          live.send(event.data);
        }
      };

      mediaRecorderRef.current.start(250); // Send data every 250ms

      setIsConnected(true);
      setIsConnecting(false);

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      for await (const chunk of live.stream()) {
        if (chunk.output?.transcription) {
          const newPart: TranscriptionPart = {
            text: chunk.output.transcription.text,
            source: 'model',
            final: chunk.output.transcription.final,
          };
          setTranscription((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.source === 'model' && !last.final) {
              const newPrev = [...prev];
              newPrev[newPrev.length -1] = {...last, text: last.text + newPart.text};
              return newPrev;
            }
            return [...prev, newPart];
          });
        }
        if (chunk.input?.transcription) {
          const newPart: TranscriptionPart = {
            text: chunk.input.transcription.text,
            source: 'user',
            final: chunk.input.transcription.final,
          };
          setTranscription((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.source === 'user' && !last.final) {
              const newPrev = [...prev];
              newPrev[newPrev.length -1] = {...last, text: newPart.text};
              return newPrev;
            }
            return [...prev, newPart];
          });
        }
        if (chunk.output?.audio) {
          const audioData = chunk.output.audio as unknown as ArrayBuffer;
          const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
          sourceNodeRef.current = audioContextRef.current.createBufferSource();
          sourceNodeRef.current.buffer = audioBuffer;
          sourceNodeRef.current.connect(audioContextRef.current.destination);
          sourceNodeRef.current.start();
        }
      }
    } catch (err) {
      console.error('Error starting live assistant:', err);
      setIsConnecting(false);
    }
  };

  const stopConnection = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }
    setIsConnected(false);
  };

  useEffect(() => {
    return () => {
      stopConnection(); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-background text-foreground p-4 gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Live Assistant
        </h1>
        {isConnected && (
          <div className="flex items-center gap-2 text-red-500">
            <Circle fill="currentColor" className="w-3 h-3 animate-pulse" />
            <span>Live</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-grow border rounded-lg p-4 bg-secondary/30">
        <div className="space-y-4">
          {transcription.map((part, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                part.source === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {part.source === 'model' && <Bot className="w-6 h-6 flex-shrink-0" />}
              <p
                className={cn(
                  'max-w-[80%] rounded-lg p-3 text-sm',
                  part.source === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary',
                  !part.final && 'opacity-70'
                )}
              >
                {part.text}
              </p>
              {part.source === 'user' && <User className="w-6 h-6 flex-shrink-0" />}
            </div>
          ))}
          {transcription.length === 0 && (
             <div className="text-center text-muted-foreground pt-16">
                <Mic className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4">Click "Start Conversation" to talk to Gemini.</p>
              </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-center">
        {isConnected ? (
          <Button onClick={stopConnection} variant="destructive" size="lg" className="rounded-full w-36 h-16">
            <MicOff className="w-6 h-6 mr-2" />
            Stop
          </Button>
        ) : (
          <Button onClick={startConnection} size="lg" disabled={isConnecting} className="rounded-full w-48 h-16">
            {isConnecting ? (
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <Mic className="w-6 h-6 mr-2" />
            )}
            {isConnecting ? 'Connecting...' : 'Start Conversation'}
          </Button>
        )}
      </div>
    </div>
  );
}
