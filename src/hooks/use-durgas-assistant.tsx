'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { assistant, textToSpeech } from '@/ai/flows/assistant-flow';
import { useDesktop } from '@/context/DesktopContext';

type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface DurgasAssistantContextType {
  isAssistantOpen: boolean;
  assistantState: AssistantState;
  toggleAssistant: () => void;
}

const DurgasAssistantContext = createContext<DurgasAssistantContextType | undefined>(undefined);

export const DurgasAssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { openApp } = useDesktop();

  const processCommand = useCallback(async (prompt: string) => {
    setAssistantState('thinking');
    try {
      const response = await assistant({ prompt });
      
      if(response.toolCall?.name === 'openApp' && response.toolCall?.input.appId) {
        openApp(response.toolCall.input.appId);
      }

      setAssistantState('speaking');
      const ttsResponse = await textToSpeech({ text: response.text });
      
      if (ttsResponse.media) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = ttsResponse.media;
        audioRef.current.play();
        audioRef.current.onended = () => {
          setIsAssistantOpen(false);
          setAssistantState('idle');
        };
      } else {
        setIsAssistantOpen(false);
        setAssistantState('idle');
      }
    } catch (error) {
      console.error('Assistant error:', error);
      setAssistantState('idle');
      setIsAssistantOpen(false);
    }
  }, [openApp]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      processCommand(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setAssistantState('idle');
      setIsAssistantOpen(false);
    };
    
    recognitionRef.current.onend = () => {
        if(assistantState === 'listening') {
            setAssistantState('idle');
            setIsAssistantOpen(false);
        }
    };

  }, [processCommand, assistantState]);
  
  const toggleAssistant = () => {
    if (isAssistantOpen) {
      recognitionRef.current?.stop();
      setIsAssistantOpen(false);
      setAssistantState('idle');
    } else {
      setIsAssistantOpen(true);
      setAssistantState('listening');
      recognitionRef.current?.start();
    }
  };


  return (
    <DurgasAssistantContext.Provider value={{ isAssistantOpen, assistantState, toggleAssistant }}>
      {children}
    </DurgasAssistantContext.Provider>
  );
};

export const useDurgasAssistant = () => {
  const context = useContext(DurgasAssistantContext);
  if (context === undefined) {
    throw new Error('useDurgasAssistant must be used within a DurgasAssistantProvider');
  }
  return context;
};
