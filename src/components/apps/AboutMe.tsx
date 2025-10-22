'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function AboutMe() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  return (
    <div className="h-full p-6 text-foreground overflow-y-auto">
      <div className="flex flex-col items-center">
        <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
          <AvatarImage src={userAvatar?.imageUrl} alt="User Avatar" data-ai-hint={userAvatar?.imageHint} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">DURGAS</h1>
        <p className="text-muted-foreground">Full-Stack Developer & UI/UX Enthusiast</p>
        <div className="flex gap-4 mt-4">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github /></a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin /></a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></a>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">About</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Hello! I&apos;m a passionate developer with a knack for creating beautiful, functional, and user-centric digital experiences. This Windows 11 simulator is a testament to my love for detail and my skills in modern web technologies. I thrive on challenges and am constantly learning to stay at the forefront of the ever-evolving tech landscape.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>React</Badge>
          <Badge>Next.js</Badge>
          <Badge>TypeScript</Badge>
          <Badge>Tailwind CSS</Badge>
          <Badge>Node.js</Badge>
          <Badge>Firebase</Badge>
          <Badge>UI/UX Design</Badge>
          <Badge>Figma</Badge>
          <Badge>GenAI</Badge>
        </div>
      </div>
    </div>
  );
}
