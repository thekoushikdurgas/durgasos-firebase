'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateImage } from '@/ai/flows/creator-studio-flow';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2, ImageIcon, ImagePlay, ScanText, Mic } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '../ui/input';

export default function CreatorStudio() {
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!generatePrompt) return;
    setLoading(true);
    setError('');
    setImageUrl('');
    try {
      const result = await generateImage({ prompt: generatePrompt, aspectRatio });
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
    <div className="h-full flex flex-col bg-background text-foreground">
      <header className="flex items-center gap-2 p-2 border-b flex-shrink-0">
        <Wand2 className="w-5 h-5" />
        <h1 className="text-lg font-bold">Creator Studio</h1>
      </header>
      <Tabs defaultValue="generate" className="flex-grow flex flex-col">
        <TabsList className="m-2">
          <TabsTrigger value="generate"><ImageIcon className="mr-2" />Generate</TabsTrigger>
          <TabsTrigger value="edit"><ImagePlay className="mr-2" />Edit</TabsTrigger>
          <TabsTrigger value="analyze"><ScanText className="mr-2" />Analyze</TabsTrigger>
          <TabsTrigger value="transcribe"><Mic className="mr-2" />Transcribe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="flex-grow flex flex-col p-4 gap-4 m-0">
           <div className="flex-grow flex items-center justify-center bg-secondary/30 rounded-lg overflow-hidden border">
            {loading && <Skeleton className="w-full h-full" />}
            {!loading && imageUrl && (
              <Image
                src={imageUrl}
                alt={generatePrompt}
                width={512}
                height={512}
                className="object-contain w-full h-full"
              />
            )}
            {!loading && !imageUrl && (
              <div className="text-center text-muted-foreground p-4">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Your generated image will appear here.</p>
                {error && <p className="text-destructive mt-2">{error}</p>}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Describe the image you want to create..."
              value={generatePrompt}
              onChange={(e) => setGeneratePrompt(e.target.value)}
              className="resize-none"
              rows={3}
              disabled={loading}
            />
            <div className='flex gap-2'>
              <div className='flex-grow'>
                <Label htmlFor='aspect-ratio' className='text-xs text-muted-foreground'>Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={loading}>
                  <SelectTrigger id='aspect-ratio'>
                    <SelectValue placeholder="Aspect Ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                    <SelectItem value="3:4">Tall (3:4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} disabled={loading || !generatePrompt} className='self-end'>
                {loading ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="edit" className="flex-grow flex flex-col p-4 gap-4 m-0">
          <div className="flex-grow flex items-center justify-center bg-secondary/30 rounded-lg overflow-hidden border">
            <div className="text-center text-muted-foreground p-4">
              <ImagePlay className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">Upload an image to start editing.</p>
              <Button variant="outline" className="mt-4">Upload Image</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Textarea placeholder="Describe the edits you want to make..." className="resize-none" rows={3} />
            <Button>Apply Edits</Button>
          </div>
        </TabsContent>

        <TabsContent value="analyze" className="flex-grow flex flex-col p-4 gap-4 m-0">
          <div className="flex-grow flex items-center justify-center bg-secondary/30 rounded-lg overflow-hidden border">
            <div className="text-center text-muted-foreground p-4">
              <ScanText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">Upload an image or video to analyze.</p>
              <Button variant="outline" className="mt-4">Upload Media</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Textarea placeholder="Ask a question about the media..." className="resize-none" rows={3} />
            <Button>Analyze</Button>
          </div>
        </TabsContent>

        <TabsContent value="transcribe" className="flex-grow flex flex-col p-4 gap-4 m-0">
          <div className="flex-grow flex items-center justify-center bg-secondary/30 rounded-lg overflow-hidden border">
            <div className="text-center text-muted-foreground p-4">
              <Mic className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">Upload an audio file to transcribe.</p>
              <Button variant="outline" className="mt-4">Upload Audio</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Textarea placeholder="Transcription will appear here..." className="resize-none" rows={5} readOnly />
            <Button>Transcribe</Button>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
