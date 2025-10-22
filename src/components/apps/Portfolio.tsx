'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    id: 1,
    title: 'Project Alpha',
    description: 'An innovative e-commerce platform with a focus on user experience and performance.',
    tags: ['Next.js', 'TypeScript', 'Stripe'],
    image: PlaceHolderImages.find(p => p.id === 'portfolio-project-1')
  },
  {
    id: 2,
    title: 'Project Beta',
    description: 'A data visualization dashboard for analyzing complex datasets in real-time.',
    tags: ['React', 'D3.js', 'Firebase'],
    image: PlaceHolderImages.find(p => p.id === 'portfolio-project-2')
  },
  {
    id: 3,
    title: 'Project Gamma',
    description: 'A cross-platform mobile application for social networking and event planning.',
    tags: ['React Native', 'GraphQL', 'AWS'],
    image: PlaceHolderImages.find(p => p.id === 'portfolio-project-3')
  },
  {
    id: 4,
    title: 'Project Delta',
    description: 'AI-powered content generation tool using modern generative models.',
    tags: ['Python', 'Genkit', 'Next.js'],
    image: PlaceHolderImages.find(p => p.id === 'portfolio-project-4')
  }
];

export default function Portfolio() {
  return (
    <div className="h-full p-6 bg-background text-foreground overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">My Work</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="bg-secondary/50 border-white/10 flex flex-col">
            <CardHeader>
              {project.image && (
                <div className="aspect-video relative w-full rounded-md overflow-hidden mb-4">
                  <Image
                    src={project.image.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    data-ai-hint={project.image.imageHint}
                  />
                </div>
              )}
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs bg-primary/20 text-primary-foreground/80 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <Button variant="ghost" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
