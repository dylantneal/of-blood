/**
 * Data fetching utilities
 * Centralize all data fetching logic here for easy migration to CMS later
 */

import { Show, Release, YouTubeVideo, InstagramPost } from './types';
import showsData from '@/data/shows.json';
import releasesData from '@/data/releases.json';
import videosData from '@/data/videos.json';
import instagramPostsData from '@/data/instagram-posts.json';

/**
 * Get all shows
 */
export async function getShows(): Promise<Show[]> {
  // Currently reads from local JSON
  // Later: Replace with CMS API call
  return showsData as Show[];
}

/**
 * Get upcoming shows only
 */
export async function getUpcomingShows(): Promise<Show[]> {
  const shows = await getShows();
  const now = new Date();
  return shows.filter(show => new Date(show.date) > now);
}

/**
 * Get a single show by ID
 */
export async function getShow(id: string): Promise<Show | null> {
  const shows = await getShows();
  return shows.find(show => show.id === id) || null;
}

/**
 * Get all releases
 */
export async function getReleases(): Promise<Release[]> {
  // Currently reads from local JSON
  // Later: Replace with CMS API call
  return releasesData as Release[];
}

/**
 * Get a single release by ID
 */
export async function getRelease(id: string): Promise<Release | null> {
  const releases = await getReleases();
  return releases.find(release => release.id === id) || null;
}

/**
 * Get the latest release
 */
export async function getLatestRelease(): Promise<Release | null> {
  const releases = await getReleases();
  if (releases.length === 0) return null;
  
  // Sort by date descending
  const sorted = [...releases].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return sorted[0];
}

/**
 * Extract YouTube video ID from URL or return as-is if already an ID
 */
function extractVideoId(videoIdOrUrl: string): string {
  if (!videoIdOrUrl) return "";
  
  // If it's already just an ID (no special characters), return as-is
  if (!videoIdOrUrl.includes("youtube.com") && !videoIdOrUrl.includes("youtu.be")) {
    return videoIdOrUrl.trim();
  }
  
  // Extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = videoIdOrUrl.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no pattern matches, return the original (might be invalid)
  return videoIdOrUrl.trim();
}

/**
 * Get all YouTube videos
 */
export async function getYouTubeVideos(): Promise<YouTubeVideo[]> {
  // Currently reads from local JSON
  // Later: Could fetch from YouTube API
  const videos = videosData as YouTubeVideo[];
  
  // Clean up video IDs (extract from URLs if needed)
  return videos.map(video => ({
    ...video,
    videoId: extractVideoId(video.videoId),
  }));
}

/**
 * Get Instagram-style posts (from local JSON file)
 * This is a manual feed - add images and videos to data/instagram-posts.json
 * Returns posts in reverse order (newest first)
 */
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  // Read from local JSON file
  // Users can manually add images and videos here
  // Reverse the array so newest posts appear first
  const posts = instagramPostsData as InstagramPost[];
  return [...posts].reverse();
}

