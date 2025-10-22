'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock } from "lucide-react";
import { useState } from "react";

export default function Browser() {
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');
  const [inputValue, setInputValue] = useState('https://www.google.com/webhp?igu=1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputValue;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
  };
  
  return (
    <div className="h-full flex flex-col bg-background">
      <header className="flex items-center gap-2 p-2 bg-secondary/50 border-b border-border flex-shrink-0">
        <Button variant="ghost" size="icon"><ArrowLeft size={16} /></Button>
        <Button variant="ghost" size="icon"><ArrowRight size={16} /></Button>
        <Button variant="ghost" size="icon"><RotateCw size={16} /></Button>
        <Button variant="ghost" size="icon"><Home size={16} /></Button>
        <form onSubmit={handleSubmit} className="relative flex-grow">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-8 h-8 bg-background" 
          />
        </form>
      </header>
      <div className="flex-grow bg-white">
        <iframe
          src={url}
          title="Browser"
          className="w-full h-full border-none"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
          onError={() => console.error(`Failed to load ${url}`)}
        />
      </div>
    </div>
  );
}
