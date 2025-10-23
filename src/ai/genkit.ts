import {genkit} from 'genkit';
import {googleAI, genkitLive} from '@genkit-ai/google-genai';
import {next} from '@genkit-ai/next';

export const ai = genkit({
  plugins: [googleAI({apiVersion: "v1beta"}), genkitLive(), next()],
  model: 'googleai/gemini-2.5-flash',
});
