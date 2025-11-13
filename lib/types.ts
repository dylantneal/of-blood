// Core data types for Of Blood

export type Show = {
  id: string;
  date: string;
  city: string;
  venue: string;
  ticketUrl?: string;
  onSale?: boolean;
  isSoldOut?: boolean;
};

export type Track = {
  n: number;
  title: string;
  lyricsPath?: string;
  audioUrl?: string; // Path to audio file in /public/audio/
  duration?: number; // Duration in seconds
};

export type Release = {
  id: string;
  title: string;
  type: 'Single' | 'EP' | 'Album';
  date: string;
  cover: string;
  links: {
    spotify?: string;
    apple?: string;
    youtube?: string;
    bandcamp?: string;
  };
  tracks?: Track[];
  description?: string;
};

export type NowPlaying = {
  track: Track;
  release: Release;
  releaseId: string;
  trackIndex: number;
} | null;

export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  handle: string;
  tags?: string[];
  description?: string;
  variants?: {
    id: string;
    title: string;
    available: boolean;
  }[];
};

export type Post = {
  id: string;
  date: string;
  title: string;
  slug: string;
  excerpt: string;
  cover?: string;
  content?: string;
};

export type MediaItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  date?: string;
};

export type ContactFormData = {
  name: string;
  email: string;
  venue?: string;
  date?: string;
  message: string;
  type: 'booking' | 'general' | 'press';
};

export type NewsletterFormData = {
  email: string;
  name?: string;
};

