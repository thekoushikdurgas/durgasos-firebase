'use server';
/**
 * @fileOverview A flow for generating images from a text prompt.
 *
 * - generateImage - A function that takes a text prompt and returns an image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export async function generateImage(prompt: string) {
  const { media } = await ai.generate({
    model: 'googleai/imagen-4.0-fast-generate-001',
    prompt: prompt,
  });
  return { media };
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: z.string(),
    outputSchema: z.any(),
  },
  async (prompt) => {
    return await generateImage(prompt);
  }
);
