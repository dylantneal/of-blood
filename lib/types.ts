// Core data types for Of Blood

export type Show = {
  id: string;
  date: string;
  city: string;
  state?: string;
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

