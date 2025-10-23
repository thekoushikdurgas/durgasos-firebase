'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { assistant, textToSpeech } from '@/ai/flows/assistant-flow';
import { useDesktop } from '@/context/DesktopContext';
import { MessageData } from 'genkit/experimental/ai';

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
  
  const wakeWordRecognizerRef = useRef<SpeechRecognition | null>(null);
  const commandRecognizerRef = useRef<SpeechRecognition | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { openApp } = useDesktop();
  const conversationHistory = useRef<MessageData[]>([]);
  const isStoppingWakeWord = useRef(false);


  const speakResponse = useCallback(async (text: string) => {
    setAssistantState('speaking');
    try {
        const ttsResponse = await textToSpeech({ text });
        if (ttsResponse.media) {
            if (!audioRef.current) {
                audioRef.current = new Audio();
            }
            audioRef.current.src = ttsResponse.media;
            audioRef.current.play();
            audioRef.current.onended = () => {
                setIsAssistantOpen(false);
                setAssistantState('idle');
                // Restart wake word listener after speaking
                isStoppingWakeWord.current = false;
                wakeWordRecognizerRef.current?.start();
            };
        } else {
            setIsAssistantOpen(false);
            setAssistantState('idle');
            isStoppingWakeWord.current = false;
            wakeWordRecognizerRef.current?.start();
        }
    } catch (error) {
        console.error('TTS error:', error);
        setIsAssistantOpen(false);
        setAssistantState('idle');
        isStoppingWakeWord.current = false;
        wakeWordRecognizerRef.current?.start();
    }
}, []);

  const executeFunctionCall = useCallback((toolCall: any) => {
    // In a real app, you would have a mapping of tool names to actual functions.
    if(toolCall.name === 'openApp') {
        openApp(toolCall.input.appId);
        return `Successfully opened the ${toolCall.input.appId} application.`;
    }
    if(toolCall.name === 'createFolder') {
        // Here you would interact with your file system state
        console.log(`Simulating folder creation: ${toolCall.input.folderName}`);
        return `Folder '${toolCall.input.folderName}' created successfully.`;
    }
    return `Unknown tool: ${toolCall.name}`;
}, [openApp]);

  const processCommand = useCallback(async (prompt: string) => {
    setAssistantState('thinking');
    conversationHistory.current = [{ role: 'user', content: [{ text: prompt }] }];
    
    try {
        // First API call to get intent / function call
        const response1 = await assistant({ prompt });

        if (response1.toolCall) {
            conversationHistory.current.push({ role: 'model', content: [response1] });
            const toolResult = executeFunctionCall(response1.toolCall);
            
            conversationHistory.current.push({
                role: 'tool',
                content: [{
                    id: response1.toolCall.id,
                    tool: { name: response1.toolCall.name, output: toolResult }
                }]
            });
            
            // Second API call with tool result to get natural language response
            const finalResponse = await assistant({ history: conversationHistory.current });
            await speakResponse(finalResponse.text);

        } else {
            // No tool call, just speak the direct response
            await speakResponse(response1.text);
        }

    } catch (error) {
        console.error('Assistant error:', error);
        await speakResponse("Sorry, I ran into an error.");
    }
  }, [executeFunctionCall, speakResponse]);

  const startCommandRecognition = useCallback(() => {
    setIsAssistantOpen(true);
    setAssistantState('listening');
    commandRecognizerRef.current?.start();
  }, []);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
        console.error('Speech recognition not supported in this browser.');
        return;
    }
    const SpeechRecognition = window.webkitSpeechRecognition;

    // Wake Word Recognizer
    wakeWordRecognizerRef.current = new SpeechRecognition();
    wakeWordRecognizerRef.current.continuous = true;
    wakeWordRecognizerRef.current.interimResults = false;
    wakeWordRecognizerRef.current.lang = 'en-US';
    
    wakeWordRecognizerRef.current.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript.trim().toLowerCase();
            if (transcript.includes('durgas')) {
                console.log('Wake word detected!');
                isStoppingWakeWord.current = true;
                wakeWordRecognizerRef.current?.stop();
                startCommandRecognition();
            }
        }
    };
    wakeWordRecognizerRef.current.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Wake word recognition error:', event.error);
      }
    };
    wakeWordRecognizerRef.current.onend = () => {
        // Restart the recognizer if it stops for any reason other than us explicitly stopping it
        if (!isStoppingWakeWord.current) {
            wakeWordRecognizerRef.current?.start();
        }
    };
    wakeWordRecognizerRef.current.start();


    // Command Recognizer
    commandRecognizerRef.current = new SpeechRecognition();
    commandRecognizerRef.current.continuous = false;
    commandRecognizerRef.current.interimResults = false;
    commandRecognizerRef.current.lang = 'en-US';

    commandRecognizerRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Command Transcript:', transcript);
        processCommand(transcript);
    };

    commandRecognizerRef.current.onerror = (event) => {
        console.error('Command recognition error:', event.error);
        setAssistantState('idle');
        setIsAssistantOpen(false);
        // Restart wake word listener on error
        isStoppingWakeWord.current = false;
        wakeWordRecognizerRef.current?.start();
    };

    commandRecognizerRef.current.onend = () => {
        // This will fire after speech stops. If we are still in 'listening'
        // it means no command was processed, so we go back to idle.
        if (assistantState === 'listening') {
            setAssistantState('idle');
            setIsAssistantOpen(false);
            // Restart wake word listener
            isStoppingWakeWord.current = false;
            wakeWordRecognizerRef.current?.start();
        }
    };

    return () => {
      isStoppingWakeWord.current = true;
      wakeWordRecognizerRef.current?.stop();
      commandRecognizerRef.current?.stop();
    }

  }, [processCommand, startCommandRecognition, assistantState]);

  const toggleAssistant = () => {
    if (isAssistantOpen) {
        commandRecognizerRef.current?.stop();
        setIsAssistantOpen(false);
        setAssistantState('idle');
        isStoppingWakeWord.current = false;
        wakeWordRecognizerRef.current?.start();
    } else {
        isStoppingWakeWord.current = true;
        wakeWordRecognizerRef.current?.stop();
        startCommandRecognition();
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
