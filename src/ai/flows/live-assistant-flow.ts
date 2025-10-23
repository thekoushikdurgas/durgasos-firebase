'use server';
/**
 * @fileOverview A Genkit flow for handling real-time voice conversations.
 *
 * - liveAssistant - A flow that establishes a bidirectional audio stream with Gemini.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const liveAssistant = ai.defineFlow(
  {
    name: 'liveAssistant',
    inputSchema: z.void(),
    outputSchema: z.void(),
  },
  async (stream) => {
    const llm = googleAI.model('gemini-2.5-flash-native-audio-preview-09-2025');

    await ai.live.connect(
      {
        llm,
        input: {
          stream,
          audio: {
            format: 'webM',
          },
          transcription: true,
        },
        output: {
          audio: true,
          transcription: true,
        },
      },
      async (live) => {
        for await (const chunk of live.stream()) {
          if (chunk.output?.audio) {
            // The client will handle playing the audio.
          }
        }
      }
    );
  }
);
