'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateImage } from '@/ai/flows/generate-image-flow';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2 } from 'lucide-react';

export default function ImageStudio() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    setImageUrl('');
    try {
      const result = await generateImage(prompt);
      if (result.media?.url) {
        setImageUrl(result.media.url);
      } else {
        setError('Failed to generate image. The model may have returned an empty response.');
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground p-4 gap-4">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Wand2 className="w-5 h-5" />
        AI Image Studio
      </h1>
      <div className="flex-grow flex items-center justify-center bg-secondary/30 rounded-lg overflow-hidden">
        {loading && <Skeleton className="w-full h-full" />}
        {!loading && imageUrl && (
          <Image
            src={imageUrl}
            alt={prompt}
            width={512}
            height={512}
            className="object-contain w-full h-full"
          />
        )}
        {!loading && !imageUrl && (
           <div className="text-center text-muted-foreground p-4">
             <p>Your generated image will appear here.</p>
             {error && <p className="text-destructive mt-2">{error}</p>}
           </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Describe the image you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="resize-none"
          rows={3}
          disabled={loading}
        />
        <Button onClick={handleGenerate} disabled={loading || !prompt}>
          {loading ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </div>
  );
}
