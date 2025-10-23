import {genkit, Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import next from '@genkit-ai/next';

let ai: Genkit;

export async function getGenkit() {
  if (ai) {
    return ai;
  }
  ai = genkit({
    plugins: [
      googleAI({apiVersion: 'v1beta'}),
      next(),
    ],
  });
  ai.model = 'googleai/gemini-2.5-flash';
  return ai;
}
