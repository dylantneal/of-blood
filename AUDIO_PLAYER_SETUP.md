# Audio Player System - Setup Guide

## Overview

A persistent, global audio player has been implemented that:
- ✅ Plays continuously across all pages
- ✅ Stays fixed at the bottom of the screen
- ✅ Can be minimized to a compact bar
- ✅ Doesn't interfere with content (content has bottom padding)
- ✅ Shows current track info, progress, and controls
- ✅ Supports play/pause, next/previous, volume control, and seeking

## File Structure

```
contexts/
  audio-context.tsx          # Global audio state management
components/
  audio/
    audio-player.tsx        # The player UI component
app/
  music/
    page.tsx                # Updated music page with playable tracks
    layout.tsx              # Metadata for music page
data/
  releases.json             # Updated with audioUrl fields
public/
  audio/                    # Place your MP3 files here
    README.md               # Instructions for audio files
```

## How It Works

### 1. Audio Context (`contexts/audio-context.tsx`)
- Manages global audio state (current track, playing status, volume, etc.)
- Handles audio playback logic
- Provides hooks for components to interact with the player

### 2. Audio Player Component (`components/audio/audio-player.tsx`)
- Fixed position at bottom of screen
- Two modes: **Expanded** (full controls) and **Minimized** (compact bar)
- Shows album art, track info, progress bar, and all controls
- Responsive design for mobile and desktop

### 3. Music Page Updates
- Tracks are now clickable if they have an `audioUrl`
- Visual indicators show which track is currently playing
- Play/pause icons update based on state

## Adding Audio Files

### Step 1: Add Audio Files
Place your MP3 files in `public/audio/` directory:
```
public/audio/tendrils-of-descending-divinity.mp3
public/audio/your-next-track.mp3
```

### Step 2: Update Releases Data
Edit `data/releases.json` to include `audioUrl` for each track:

```json
{
  "id": "1",
  "title": "Release Title",
  "tracks": [
    {
      "n": 1,
      "title": "Track Name",
      "audioUrl": "/audio/track-filename.mp3",
      "duration": 240  // Optional: seconds
    }
  ]
}
```

**Note**: The `duration` field is optional. If not provided, it will be automatically detected when the audio loads.

## Features

### Player Controls
- **Play/Pause**: Toggle playback
- **Previous/Next**: Navigate tracks (plays next in release or queue)
- **Seek**: Click progress bar to jump to any position
- **Volume**: Adjust volume with slider (desktop) or tap to mute
- **Minimize**: Collapse to compact bar to save screen space

### Visual Feedback
- Currently playing track is highlighted on the music page
- Progress bar shows playback position
- Album art displays in player (if available)
- Track info shows title and release name

### Responsive Design
- **Desktop**: Full player with all controls visible
- **Mobile**: Compact layout with essential controls, volume slider below

## Customization

### Player Position
The player is fixed at the bottom. Content has bottom padding (`pb-32 md:pb-36`) to prevent overlap.

To adjust spacing, edit `app/layout.tsx`:
```tsx
<main className="min-h-screen pt-20 pb-32 md:pb-36">
```

### Player Height
- Expanded: `h-24 md:h-28` (96px/112px)
- Minimized: `h-16` (64px)

Edit in `components/audio/audio-player.tsx` if needed.

### Styling
The player uses your existing design system:
- Background: `bg-background/95` with backdrop blur
- Border: `border-line` (matches site theme)
- Primary color: Uses `primary` for progress bar and active states
- Gold accents: For track numbers and highlights

## Usage in Other Components

To control the player from any component:

```tsx
"use client";

import { useAudio } from "@/contexts/audio-context";

export function MyComponent() {
  const { playTrack, playPause, nowPlaying, isPlaying } = useAudio();
  
  const handlePlay = () => {
    playTrack(track, release, releaseId, trackIndex);
  };
  
  return (
    <button onClick={handlePlay}>
      {isPlaying && nowPlaying?.track.title === track.title 
        ? "Pause" 
        : "Play"}
    </button>
  );
}
```

## Browser Compatibility

- Uses native HTML5 `<audio>` element
- Works in all modern browsers
- MP3 format recommended for best compatibility
- Falls back gracefully if audio file is missing

## Future Enhancements

Potential additions:
- Playlist/queue management UI
- Shuffle and repeat modes
- Keyboard shortcuts (spacebar for play/pause, etc.)
- Audio visualization/spectrum
- Crossfade between tracks
- Playback speed control

## Troubleshooting

### Audio doesn't play
1. Check that `audioUrl` in releases.json matches the file path
2. Ensure file is in `public/audio/` directory
3. Check browser console for errors
4. Verify file format (MP3 recommended)

### Player doesn't appear
- Player only shows when a track is playing
- Check that `AudioProvider` wraps your app in `app/layout.tsx`

### Content is covered by player
- Content should have bottom padding automatically
- If issues persist, check `app/layout.tsx` has `pb-32 md:pb-36` on main element

