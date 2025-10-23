'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { chat, textToSpeech } from '@/ai/flows/chat-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, Volume2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Message = {
  role: 'user' | 'model';
  content: string;
};

type Model = 'gemini-2.5-flash-lite' | 'gemini-2.5-flash' | 'gemini-2.5-pro';

const models: { value: Model; label: string }[] = [
  { value: 'gemini-2.5-flash-lite', label: 'Flash Lite (Fastest)' },
  { value: 'gemini-2.5-flash', label: 'Flash (Balanced)' },
  { value: 'gemini-2.5-pro', label: 'Pro (Advanced)' },
];

export default function GeminiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState<Model>('gemini-2.5-flash');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setAudioUrl(null);

    const history = [...messages, userMessage].map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    try {
      const response = await chat({ history, model });
      const modelMessage: Message = { role: 'model', content: response.text ?? '' };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage: Message = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    const lastModelMessage = messages.slice().reverse().find(m => m.role === 'model');
    if (!lastModelMessage || audioLoading) return;
    
    setAudioLoading(true);
    try {
      const response = await textToSpeech({ text: lastModelMessage.content });
      setAudioUrl(response.media);
    } catch (e) {
      console.error('TTS Error:', e);
    } finally {
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-2 border-b">
        <h1 className="text-sm font-semibold">Gemini Chat</h1>
        <Select value={model} onValueChange={(value: Model) => setModel(value)}>
          <SelectTrigger className="w-[200px] h-8 text-xs">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m.value} value={m.value} className="text-xs">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'model' && (
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-lg p-3 text-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
               {message.role === 'user' && userAvatar && (
                <Avatar className="w-8 h-8 border">
                  <AvatarImage src={userAvatar.imageUrl} alt="User" />
                  <AvatarFallback><User size={18} /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="w-8 h-8 border">
                 <AvatarFallback><Bot size={18} /></AvatarFallback>
              </Avatar>
              <div className="bg-secondary rounded-lg p-3">
                 <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <footer className="p-2 border-t flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-grow resize-none"
            rows={2}
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>
         {messages.some(m => m.role === 'model') && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayAudio}
              disabled={audioLoading || loading}
              className="self-start"
            >
              {audioLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="mr-2 h-4 w-4" />
              )}
              Read Aloud
            </Button>
          )}
      </footer>
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}
    </div>
  );
}
