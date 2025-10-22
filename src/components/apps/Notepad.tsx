'use client';

interface NotepadProps {
  data?: {
    content?: string;
  };
}

export default function Notepad({ data }: NotepadProps) {
  const content = data?.content || 'This is a new file.';

  return (
    <div className="h-full bg-white text-black font-mono">
      <textarea
        className="h-full w-full resize-none border-none bg-transparent p-4 text-sm outline-none"
        defaultValue={content}
        readOnly
      />
    </div>
  );
}
