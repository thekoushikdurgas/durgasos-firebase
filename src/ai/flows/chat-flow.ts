'use server';
/**
 * @fileOverview A Genkit flow for handling chat conversations and text-to-speech.
 *
 * - chat - A function that takes a message history and returns a response from Gemini.
 * - textToSpeech - A function that converts text into speech audio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';
import { MessageData } from 'genkit/experimental/ai';

const ChatInputSchema = z.object({
  history: z.array(z.any()),
  model: z.string(),
});

export async function chat(input: z.infer<typeof ChatInputSchema>) {
  const { history, model } = input;

  const response = await ai.generate({
    model: googleAI.model(model),
    prompt: [
      ...history.map(message => ({
        role: message.role,
        content: message.content,
      })),
    ],
  });

  return response;
}

const TextToSpeechInputSchema = z.object({
  text: z.string(),
});

export async function textToSpeech(input: z.infer<typeof TextToSpeechInputSchema>) {
  const { media } = await ai.generate({
    model: googleAI.model('gemini-2.5-flash-preview-tts'),
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Algenib' },
        },
      },
    },
    prompt: input.text,
  });

  if (!media) {
    throw new Error('No media returned from TTS model.');
  }

  const audioBuffer = Buffer.from(
    media.url.substring(media.url.indexOf(',') + 1),
    'base64'
  );

  const wavData = await toWav(audioBuffer);

  return { media: 'data:audio/wav;base64,' + wavData };
}

// Helper to convert PCM audio data to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.any(),
  },
  chat
);

ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: z.any(),
  },
  textToSpeech
);
