'use server';
/**
 * @fileOverview A Genkit flow for the Durgas Assistant.
 *
 * - assistant - A function that takes a prompt and returns a response from Gemini, potentially calling tools.
 * - textToSpeech - A function that converts text into speech audio.
 */

import { getGenkit } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';
import { defineTool } from '@genkit-ai/ai';

const AssistantInputSchema = z.object({
  prompt: z.string(),
});

const openAppTool = defineTool(
  {
    name: 'openApp',
    description: 'Opens an application on the desktop',
    inputSchema: z.object({
      appId: z.string().describe('The ID of the app to open'),
    }),
    outputSchema: z.string(),
  },
  async ({ appId }) => {
    // This is a placeholder. The actual app opening is handled on the client.
    return `Successfully opened ${appId}`;
  }
);


export async function assistant(input: z.infer<typeof AssistantInputSchema>) {
  const ai = await getGenkit();
  const { prompt } = input;

  const llm = googleAI.model('gemini-2.5-flash');

  const response = await ai.generate({
    model: llm,
    prompt: `You are Durgas, a helpful OS assistant. The user's prompt is: "${prompt}". Respond concisely.`,
    tools: [openAppTool],
  });

  const toolCalls = response.toolCalls();
  if (toolCalls.length > 0) {
    const toolCall = toolCalls[0];
    // In a real scenario, you'd execute the tool and return the result.
    // For this simulation, we'll just confirm the action.
    const toolResponse = {
      id: toolCall.id,
      tool: {
        name: toolCall.name,
        output: `App ${toolCall.input.appId} has been opened.`,
      },
    };
    
    const finalResponse = await ai.generate({
        model: llm,
        prompt: `You are Durgas, a helpful OS assistant. The user's prompt is: "${prompt}". Respond concisely.`,
        history: [
            {role: 'user', content: [{text: prompt}]},
            {role: 'model', content: [response.content[0]]},
            toolResponse
        ]
    });
    
    return {
        text: finalResponse.text(),
        toolCall: {
            name: toolCall.name,
            input: toolCall.input,
        }
    };
  }

  return { text: response.text(), toolCall: null };
}

const TextToSpeechInputSchema = z.object({
  text: z.string(),
});

export async function textToSpeech(input: z.infer<typeof TextToSpeechInputSchema>) {
  const ai = await getGenkit();
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

getGenkit().then(ai => {
  ai.defineFlow(
    {
      name: 'assistantFlow',
      inputSchema: AssistantInputSchema,
      outputSchema: z.any(),
    },
    assistant
  );

  ai.defineFlow(
    {
      name: 'textToSpeechFlow',
      inputSchema: TextToSpeechInputSchema,
      outputSchema: z.any(),
    },
    textToSpeech
  );
});
