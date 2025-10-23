'use client';

interface VideoPlayerProps {
  data?: {
    content?: string; // This will be the video URL
    fileName?: string;
  };
}

export default function VideoPlayer({ data }: VideoPlayerProps) {
  const videoUrl = data?.content;

  if (!videoUrl) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black text-white">
        No video file specified.
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black flex items-center justify-center">
      <video
        src={videoUrl}
        controls
        autoPlay
        className="max-h-full max-w-full"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
