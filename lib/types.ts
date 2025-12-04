// Core data types for Of Blood

export type ShowMedia = {
  id?: string;
  type: 'image' | 'youtube';
  url: string;
  title?: string;
  caption?: string;
  thumbnail?: string;
};

export type Show = {
  id: string;
  date: string;
  city: string;
  state?: string;
  venue: string;
  ticketUrl?: string;
  onSale?: boolean;
  isSoldOut?: boolean;
  media?: ShowMedia[];
};

// Visual theme configuration for immersive experience
export type TrackTheme = {
  colors: {
    primary: string;      // Main accent (e.g., blood red)
    secondary: string;    // Secondary color (e.g., cosmic purple)
    background: string;   // Base background
    text: string;         // Lyrics text color
    highlight: string;    // Current lyric highlight
    glow: string;         // Glow effects
  };
  background: {
    gradient: string;     // CSS gradient
    overlay?: string;     // Optional overlay gradient
    image?: string;       // Optional background image URL
  };
  particles: {
    type: 'tendrils' | 'embers' | 'blood' | 'stars' | 'fog' | 'none';
    density: number;      // 0-1
    speed: number;        // Animation speed multiplier
    direction: 'down' | 'up' | 'radial';
    audioReactivity: number; // 0-1, response to music
  };
  albumArt: {
    effect: 'breathe' | 'pulse' | 'glitch' | 'none';
    audioReactivity: number; // 0-1
  };
  // Layout configuration for immersive mode
  layout?: {
    type: 'default' | 'centered' | 'minimal';  // Layout style
    albumArt: 'always' | 'never' | 'intro-only' | 'instrumental-only';  // When to show album art
    centerpiece?: 'album' | 'eye' | 'void' | 'image' | 'none';  // What to show as main visual
    lyricsPosition?: 'right' | 'center' | 'bottom';  // Where lyrics appear
    introEndTime?: number;  // When intro ends and lyrics appear (in seconds)
  };
  // Custom visual effects
  visualEffect?: {
    type: 'eye' | 'tendrils-connected' | 'crushing-ceiling' | 'none';
    intensity: number;  // 0-1
    audioReactivity: number;  // 0-1
  };
};

export type Track = {
  n: number;
  title: string;
  slug?: string;          // URL-friendly identifier
  lyricsPath?: string;
  lyricsUrl?: string;     // Path to lyrics JSON file
  audioUrl?: string;      // Path to audio file in /public/audio/
  duration?: number;      // Duration in seconds
  theme?: TrackTheme;     // Visual theme for immersive mode
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
  priceMax?: number;
  image: string;
  images?: Array<{
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  }>;
  handle: string;
  tags?: string[];
  description?: string;
  descriptionHtml?: string;
  variants?: Array<{
    id: string;
    title: string;
    available: boolean;
    price: number;
    selectedOptions?: Array<{
      name: string;
      value: string;
    }>;
    image?: string;
  }>;
};

export type CartItem = {
  id: string; // Cart line ID
  variantId: string;
  productId: string;
  title: string;
  variantTitle: string;
  quantity: number;
  price: number;
  image: string;
  handle: string;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  totalAmount: number;
  currencyCode: string;
  items: CartItem[];
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  email: string;
  totalPrice: number;
  currencyCode: string;
  shippingAddress: ShippingAddress;
  lineItems: Array<{
    variantId: string;
    quantity: number;
    title: string;
    price: number;
  }>;
  createdAt: string;
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

export type YouTubeVideo = {
  id: string;
  videoId: string; // YouTube video ID
  title: string;
  description?: string;
  thumbnail?: string;
  publishedAt?: string;
};

export type InstagramPost = {
  id: string;
  type: 'image' | 'video' | 'youtube'; // 'youtube' for YouTube embeds
  mediaUrl: string; // For images/videos: URL. For YouTube: video ID
  caption?: string;
  date?: string;
  thumbnailUrl?: string; // For videos, optional thumbnail
  permalink?: string; // Instagram post permalink URL
};

// Lyrics and immersive experience types
export type LyricLine = {
  time: number;           // Timestamp in seconds
  text: string | null;    // Lyric text (null for instrumental)
  section?: string;       // Section identifier (verse1, chorus, etc.)
};

export type LyricSection = {
  time: number;           // Start timestamp
  name: string;           // Display name (Verse I, Chorus, etc.)
  type: 'vocal' | 'instrumental';
  intensity: number;      // 0-1, visual intensity for this section
};

export type TrackLyrics = {
  trackId: string;
  title: string;
  sections: LyricSection[];
  lines: LyricLine[];
};

// Audio analysis data (real-time)
export type AudioAnalysis = {
  bass: number;           // 0-1, low frequency intensity
  mids: number;           // 0-1, mid frequency intensity
  highs: number;          // 0-1, high frequency intensity
  overall: number;        // 0-1, overall amplitude
};

