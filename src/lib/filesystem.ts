export type FileSystemItem = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FileSystemItem[];
};

export const mockFileSystem: FileSystemItem[] = [
  {
    id: 'users',
    name: 'Users',
    type: 'folder',
    children: [
      {
        id: 'durgas',
        name: 'Durgas',
        type: 'folder',
        children: [
          {
            id: 'desktop',
            name: 'Desktop',
            type: 'folder',
            children: [
              { id: 'screenshot-1.png', name: 'screenshot-1.png', type: 'file' },
            ],
          },
          {
            id: 'documents',
            name: 'Documents',
            type: 'folder',
            children: [
              { id: 'project-plan.pdf', name: 'project-plan.pdf', type: 'file' },
              { id: 'notes.txt', name: 'notes.txt', type: 'file' },
            ],
          },
          {
            id: 'downloads',
            name: 'Downloads',
            type: 'folder',
            children: [],
          },
          {
            id: 'pictures',
            name: 'Pictures',
            type: 'folder',
            children: [
                { id: 'avatar.jpg', name: 'avatar.jpg', type: 'file' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'windows',
    name: 'Windows',
    type: 'folder',
    children: [
        { id: 'system32', name: 'system32', type: 'folder', children: [] }
    ],
  },
  {
    id: 'program-files',
    name: 'Program Files',
    type: 'folder',
    children: [],
  },
];
