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
import { MessageData } from 'genkit/experimental/ai';

const AssistantInputSchema = z.object({
  prompt: z.string().optional(),
  history: z.array(z.any()).optional(),
});


export async function assistant(input: z.infer<typeof AssistantInputSchema>) {
  const ai = await getGenkit();
  const { prompt, history } = input;
  
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

  const createFolderTool = defineTool(
    {
      name: 'createFolder',
      description: 'Creates a new folder on the desktop or other specified location.',
      inputSchema: z.object({
          folderName: z.string().describe("The name for the new folder."),
          location: z.string().optional().describe("Where to create the folder, e.g., 'Desktop'. Defaults to 'Desktop'."),
      }),
      outputSchema: z.string(),
    },
    async ({ folderName, location }) => {
        return `Folder '${folderName}' created in ${location || 'Desktop'}.`;
    }
  );


  const llm = googleAI.model('gemini-2.5-flash');
  const request: any = {
    model: llm,
    tools: [openAppTool, createFolderTool],
  };

  if (prompt) {
    request.prompt = `You are Durgas, a helpful OS assistant. The user's prompt is: "${prompt}". Respond concisely.`;
  }
  if (history) {
    request.history = history;
  }

  const response = await ai.generate(request);

  const toolCalls = response.toolCalls();

  if (toolCalls.length > 0) {
    const toolCall = toolCalls[0];
    
    // We don't execute the tool here, we just return the call to the client
    return {
        text: response.text(), // Can be empty if tool is called
        toolCall: {
            id: toolCall.id,
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
