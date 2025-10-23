import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {genkitLive} from '@genkit-ai/next';

export const ai = genkit({
  plugins: [googleAI({apiVersion: "v1beta"}), genkitLive()],
  model: 'googleai/gemini-2.5-flash',
});
