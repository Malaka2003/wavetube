export interface Track {
  id: string;
  index: number;
  title: string;
  channel: string;
  duration: number | null;
  durationFormatted: string;
  thumbnail: string;
  url: string;
  // Client state
  status?: 'idle' | 'converting' | 'ready' | 'downloaded' | 'error';
  progress?: number;
  error?: string;
  downloadUrl?: string;
  previewUrl?: string;
  fileSize?: number;
}

export interface PlaylistData {
  isPlaylist: boolean;
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  totalTracks: number;
  tracks: Track[];
}

export interface AudioSettings {
  sampleRate: number; // 44100, 48000, 96000
  bitDepth: number;   // 16, 24, 32
  channels: number;   // 2 (stereo), 1 (mono)
}

export type Language = 'si' | 'en';
