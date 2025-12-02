# Instagram-Style Feed Setup Guide

The Instagram feed is now a simple, manual system - no API setup required!

## How to Add Content

### Step 1: Add Images or Videos to Your Project

1. **For Images**: Add image files to `/public/images/instagram/` (or another subfolder inside `/public/images`)
2. **For Videos**: Add video files to `/public/videos/` (create this folder if needed)

**Supported formats:**
- Images: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Videos: `.mp4`, `.webm`, `.mov`

### Step 2: Edit `data/instagram-posts.json`

Open `data/instagram-posts.json` and add your posts:

```json
[
  {
    "id": "1",
    "type": "image",
    "mediaUrl": "/images/instagram/your-image.jpg",
    "caption": "Optional caption text",
    "date": "2025-01-15"
  },
  {
    "id": "2",
    "type": "video",
    "mediaUrl": "/videos/your-video.mp4",
    "caption": "Live performance clip",
    "date": "2025-01-16"
  },
  {
    "id": "3",
    "type": "image",
    "mediaUrl": "/images/instagram/another-photo.png",
    "caption": "Behind the scenes at the studio"
  }
]
```

### Step 3: Save and View

1. Save `data/instagram-posts.json`
2. Refresh your browser at `http://localhost:3000/media`
3. Your posts will appear in the grid!

## Features

✅ **Grid Layout**: Responsive 3-column grid (2 on tablet, 1 on mobile)  
✅ **Full-Screen Lightbox**: Click any post to view full-screen  
✅ **Swipe Navigation**: 
   - Desktop: Use arrow keys or click arrow buttons
   - Mobile: Swipe left/right
   - Keyboard: Arrow keys or Escape to close
✅ **Video Support**: Short videos with play/pause controls  
✅ **Image Support**: High-quality image viewing  
✅ **Captions**: Optional captions displayed on hover and in lightbox  
✅ **Post Counter**: Shows current position (e.g., "3 / 12")

## Example Structure

```json
[
  {
    "id": "1",
    "type": "image",
    "mediaUrl": "/images/instagram/band-photo-1.jpg",
    "caption": "Live at The Roxy Theatre",
    "date": "2025-01-20"
  },
  {
    "id": "2",
    "type": "youtube",
    "mediaUrl": "dQw4w9WgXcQ",
    "caption": "Live performance video",
    "date": "2025-01-20",
    "thumbnailUrl": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
  },
  {
    "id": "3",
    "type": "video",
    "mediaUrl": "https://res.cloudinary.com/your-cloud/video/upload/v1234567/video.mp4",
    "caption": "Soundcheck clip (hosted on Cloudinary)",
    "date": "2025-01-20"
  },
  {
    "id": "4",
    "type": "image",
    "mediaUrl": "/images/instagram/studio-session.jpg",
    "caption": "Recording session at Smash Studios"
  }
]
```

## Video Hosting Options

### Option 1: YouTube (Recommended for Large Videos)

**Best for:** Large video files (hundreds of MB)

1. Upload your video to YouTube (can be unlisted/private)
2. Get the video ID from the URL: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Use in JSON:

```json
{
  "id": "2",
  "type": "youtube",
  "mediaUrl": "VIDEO_ID",
  "caption": "Your video caption",
  "thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
}
```

**Pros:**
- ✅ Free, unlimited storage
- ✅ Automatic compression
- ✅ Works on all devices
- ✅ Views count on YouTube
- ✅ No file size limits

### Option 2: External Video URLs (Cloudinary, Vimeo, etc.)

For videos hosted on external services:

```json
{
  "id": "3",
  "type": "video",
  "mediaUrl": "https://your-cdn.com/video.mp4",
  "caption": "Video hosted externally"
}
```

**Supported Services:**
- Cloudinary (free tier: 25GB)
- Vimeo
- AWS S3 + CloudFront
- Any public video URL

## Tips

- **Image Sizes**: Use high-quality images (recommended: 1080x1080px or larger)
- **Video Sizes**: Keep videos under 50MB for best performance
- **Order**: Posts appear in the order listed in the JSON file
- **Captions**: Optional but recommended for better UX
- **Dates**: Optional but useful for organizing content

## File Paths

- Images: `/public/images/<category>/your-file.jpg` → Use `/images/<category>/your-file.jpg` in JSON
- Videos: `/public/videos/your-file.mp4` → Use `/videos/your-file.mp4` in JSON

That's it! Much simpler than the API setup. Just add your media files and update the JSON file.

