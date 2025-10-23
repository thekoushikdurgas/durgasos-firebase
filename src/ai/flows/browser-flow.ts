'use server';
/**
 * @fileOverview A Genkit flow for handling grounded browser queries.
 *
 * - browserQuery - A function that takes a query and grounding options and returns a grounded response from Gemini.
 */

import { getGenkit } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const BrowserQueryInputSchema = z.object({
  query: z.string(),
  useMaps: z.boolean(),
});

const BrowserQueryOutputSchema = z.any();

export async function browserQuery(input: z.infer<typeof BrowserQueryInputSchema>) {
  const ai = await getGenkit();
  const { query, useMaps } = input;

  const tools: any[] = [{ googleSearch: {} }];
  if (useMaps) {
    tools.push({
      googleMaps: {
        locationType: 'address',
        version: '2',
      },
    });
  }

  const llm = googleAI.model('gemini-2.5-flash');

  const response = await ai.generate({
    model: llm,
    prompt: query,
    tools,
  });

  return {
    text: response.text(),
    sources:
      response.references()?.flatMap(ref =>
        ref.tool?.outputs?.flatMap(out => out.googleSearch?.results.map(r => r.uri))
      ).filter(Boolean) || [],
  };
}

getGenkit().then(ai => {
  ai.defineFlow(
    {
      name: 'browserQueryFlow',
      inputSchema: BrowserQueryInputSchema,
      outputSchema: BrowserQueryOutputSchema,
    },
    browserQuery
  );
});
