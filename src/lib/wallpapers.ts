import { PlaceHolderImages } from "./placeholder-images";

export const wallpapers = [
    PlaceHolderImages.find((p) => p.id === 'desktop-wallpaper'),
    {
        id: 'wallpaper-2',
        imageUrl: 'https://images.unsplash.com/photo-1691231543975-1f1627c27d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMHdhbGxwYXBlcnxlbnwwfHx8fDE3NjExMDYxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 'wallpaper-3',
        imageUrl: 'https://images.unsplash.com/photo-1688649429715-3974c2d8479a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxhYnN0cmFjdCUyMHdhbGxwYXBlcnxlbnwwfHx8fDE3NjExMDYxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 'wallpaper-4',
        imageUrl: 'https://images.unsplash.com/photo-1688649429715-3974c2d8479a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxhYnN0cmFjdCUyMHdhbGxwYXBlcnxlbnwwfHx8fDE3NjExMDYxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 'wallpaper-5',
        imageUrl: 'https://images.unsplash.com/photo-1554189097-90d3b64ea3b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxhYnN0cmFjdCUyMHdhbGxwYXBlcnxlbnwwfHx8fDE3NjExMDYxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 'wallpaper-6',
        imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxhYnN0cmFjdHxlbnwwfHx8fDE3NjExMDk2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    }
].filter(Boolean) as { id: string, imageUrl: string, description?: string, imageHint?: string }[];
