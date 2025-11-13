/**
 * Data fetching utilities
 * Centralize all data fetching logic here for easy migration to CMS later
 */

import { Show, Release } from './types';
import showsData from '@/data/shows.json';
import releasesData from '@/data/releases.json';

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

