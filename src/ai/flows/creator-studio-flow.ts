'use server';
/**
 * @fileOverview A flow for creative tasks using Gemini models.
 *
 * - generateImage: Generates an image from a text prompt.
 */

import { getGenkit } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  aspectRatio: z.string().optional().describe('The desired aspect ratio for the image.'),
});

export async function generateImage(input: z.infer<typeof GenerateImageInputSchema>) {
  const ai = await getGenkit();
  const { media } = await ai.generate({
    model: 'googleai/imagen-4.0-fast-generate-001',
    prompt: input.prompt,
    config: {
        aspectRatio: input.aspectRatio
    }
  });
  return { media };
}

getGenkit().then(ai => {
  ai.defineFlow(
    {
      name: 'generateImageFlow',
      inputSchema: GenerateImageInputSchema,
      outputSchema: z.any(),
    },
    generateImage
  );
});
