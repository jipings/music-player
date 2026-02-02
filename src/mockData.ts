export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  creator: string;
}

export interface LocalFolder {
  id: string;
  name: string;
  path: string;
  songCount: number;
}

export const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'Midnight Horizons',
    artist: 'Luna Echo',
    coverUrl: '',
  },
  {
    id: '2',
    title: 'Neon Dreams',
    artist: 'The Synthetics',
    coverUrl: '',
  },
  {
    id: '3',
    title: 'Quantum Solace',
    artist: 'Orbit 9',
    coverUrl: '',
  },
  {
    id: '4',
    title: 'Deep Dive',
    artist: 'Aqua Sound',
    coverUrl: '',
  },
  {
    id: '5',
    title: 'Retrograde',
    artist: 'Vintage Vibe',
    coverUrl: '200/444444/white?text=RG',
  },
  {
    id: '6',
    title: 'Future Funk',
    artist: 'Groove Bot',
    coverUrl: '200/121212/white?text=FF',
  },
];

export const mockPlaylists: Playlist[] = [
  { id: '1', name: 'Chill Vibes', creator: 'User' },
  { id: '2', name: 'Workout Pump', creator: 'User' },
  { id: '3', name: 'Focus Flow', creator: 'User' },
];

export const mockFolders: LocalFolder[] = [
  { id: '1', name: 'Downloads', path: 'C:/Users/Music/Downloads', songCount: 42 },
  { id: '2', name: 'High-Res FLAC', path: 'D:/Music/HighRes', songCount: 156 },
  { id: '3', name: 'Soundtracks', path: 'D:/Music/OST', songCount: 89 },
  { id: '4', name: 'Voice Memos', path: 'C:/Users/Voice', songCount: 12 },
];
