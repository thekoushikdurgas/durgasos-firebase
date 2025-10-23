'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { liveAssistantFlow } from '@/ai/flows/live-assistant-flow';
import { Mic, MicOff, Bot, User, Loader2, Circle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  const liveSessionRef = useRef<any | null>(null);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcription]);


  const startConnection = async () => {
    setIsConnecting(true);
    setTranscription([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      const live = await liveAssistantFlow();
      liveSessionRef.current = live;

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && liveSessionRef.current) {
          live.send(event.data);
        }
      };

      mediaRecorderRef.current.start(250); // Send data every 250ms

      setIsConnected(true);
      setIsConnecting(false);

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      let nextStartTime = 0;

      for await (const chunk of live.stream()) {
        if (chunk.output?.transcription || chunk.input?.transcription) {
          const isModel = !!chunk.output?.transcription;
          const source = isModel ? 'model' : 'user';
          const t = isModel ? chunk.output.transcription : chunk.input.transcription;

          setTranscription((prev) => {
             const last = prev[prev.length - 1];
             // If the last part is not final and from the same source, append to it
             if (last && last.source === source && !last.final) {
                const newPrev = [...prev];
                newPrev[newPrev.length - 1] = {
                    source,
                    text: last.text + t.text,
                    final: t.final,
                };
                return newPrev;
             }
             // Otherwise, if it's a final part, create a new entry for the next part
             if (last && last.final) {
                return [...prev, { source, text: t.text, final: t.final }];
             }
             // If the last part was from a different source, create a new entry
             if(last && last.source !== source) {
                return [...prev, { source, text: t.text, final: t.final }];
             }
             // Default case: just append
             return [...prev, { source, text: t.text, final: t.final }];
          });
        }
        if (chunk.output?.audio) {
            const audioData = chunk.output.audio as unknown as ArrayBuffer;
            const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
            
            const sourceNode = audioContextRef.current.createBufferSource();
            sourceNode.buffer = audioBuffer;
            sourceNode.connect(audioContextRef.current.destination);

            const currentTime = audioContextRef.current.currentTime;
            const startTime = nextStartTime < currentTime ? currentTime : nextStartTime;
            
            sourceNode.start(startTime);
            nextStartTime = startTime + audioBuffer.duration;
        }
      }

    } catch (err: any) {
      console.error('Error starting live assistant:', err);
      toast({
          variant: "destructive",
          title: "Connection Error",
          description: err.message || "Could not connect to the live assistant."
      })
      setIsConnecting(false);
    } finally {
        stopConnection();
    }
  };

  const stopConnection = () => {
    if (liveSessionRef.current) {
        liveSessionRef.current.close();
        liveSessionRef.current = null;
    }
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
       audioContextRef.current.close();
       audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
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

      <ScrollArea className="flex-grow border rounded-lg p-4 bg-secondary/30" ref={scrollAreaRef}>
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
          {!isConnecting && transcription.length === 0 && (
             <div className="text-center text-muted-foreground pt-16">
                <Mic className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4">Click "Start Conversation" to talk to Gemini.</p>
              </div>
          )}
          {isConnecting && (
              <div className="text-center text-muted-foreground pt-16">
                <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                <p className="mt-4">Connecting to the assistant...</p>
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
