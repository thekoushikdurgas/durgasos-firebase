'use server';
/**
 * @fileOverview A Genkit flow for handling real-time voice conversations.
 *
 * - liveAssistantFlow - A function that establishes a bidirectional audio stream with Gemini.
 */

import { getGenkit } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';


async function liveAssistant(stream: any) {
  const ai = await getGenkit();
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

export async function liveAssistantFlow(stream: any) {
  const ai = await getGenkit();
  const flow = ai.defineFlow(
    {
      name: 'liveAssistant',
      inputSchema: z.any(),
      outputSchema: z.void(),
    },
    async (stream) => {
      return await liveAssistant(stream);
    }
  );
  return await flow(stream);
}
