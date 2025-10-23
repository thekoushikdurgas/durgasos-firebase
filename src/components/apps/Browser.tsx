'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { browserQuery } from '@/ai/flows/browser-flow';
import { Globe, Search, Map, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type QueryResult = {
  text: string;
  sources: string[];
};

export default function Browser() {
  const [query, setQuery] = useState('');
  const [useMaps, setUseMaps] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const response = await browserQuery({ query, useMaps });
      setResult(response);
    } catch (e: any) {
      console.error(e);
      setError('An error occurred while fetching the response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <header className="flex items-center gap-2 p-2 bg-secondary/50 border-b border-border flex-shrink-0">
        <Globe className="w-5 h-5" />
        <h1 className="text-lg font-bold">Intelligent Browser</h1>
      </header>
      <div className="flex flex-col p-4 gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ask anything..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={loading}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading || !query.trim()} className='w-full sm:w-auto'>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className='mr-2'/>}
            Search
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="use-maps" checked={useMaps} onCheckedChange={setUseMaps} disabled={loading} />
          <Label htmlFor="use-maps" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Map className="w-4 h-4" />
            Ground with Google Maps
          </Label>
        </div>
      </div>
      <ScrollArea className="flex-grow p-4 pt-0">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}
        {error && (
            <div className="text-center text-destructive p-8">{error}</div>
        )}
        {result && (
          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Answer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap leading-relaxed">{result.text}</p>
                </CardContent>
            </Card>

            {result.sources.length > 0 && (
              <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><LinkIcon className='w-5 h-5'/>Sources</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        {result.sources.map((source, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <LinkIcon className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                            <a
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                            title={source}
                            >
                            {source}
                            </a>
                        </li>
                        ))}
                    </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
         {!loading && !result && !error && (
            <div className="text-center text-muted-foreground pt-16">
                <Globe className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4">Your grounded search results will appear here.</p>
              </div>
          )}
      </ScrollArea>
    </div>
  );
}
