# Media Page Setup Guide

The Media page now includes two sections: **Videos** (YouTube) and **Photos** (Instagram).

## YouTube Videos Setup

### Adding Videos

1. Edit `data/videos.json` and add your YouTube videos:

```json
[
  {
    "id": "1",
    "videoId": "dQw4w9WgXcQ",
    "title": "Your Video Title",
    "description": "Optional description",
    "thumbnail": "Optional custom thumbnail URL",
    "publishedAt": "2025-01-01"
  }
]
```

2. The `videoId` is the part after `v=` in a YouTube URL:
   - URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - videoId: `dQw4w9WgXcQ`

### Features

- ✅ Full YouTube player with all standard controls (play, pause, volume, fullscreen, etc.)
- ✅ Views count on YouTube when played on your site
- ✅ Thumbnail previews
- ✅ Modal player with full-screen support
- ✅ Responsive design

## Instagram Photos Setup

### Prerequisites

You'll need to set up Instagram Basic Display API:

1. **Create a Facebook App**:
   - Go to https://developers.facebook.com/apps/
   - Create a new app
   - Add "Instagram Basic Display" product

2. **Configure Instagram Basic Display**:
   - Add your Instagram account
   - Set up OAuth redirect URIs
   - Generate an access token

3. **Get Your Credentials**:
   - Access Token: From the Instagram Basic Display API
   - User ID: Your Instagram user ID (can be extracted from the token)

### Environment Variables

Add these to your `.env.local`:

```bash
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_USER_ID=your_instagram_user_id  # Optional, will be auto-detected
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Your site URL
```

### Features

- ✅ Fetches 9 most recent Instagram posts
- ✅ Displays images in a responsive grid
- ✅ Lightbox modal for viewing full-size images
- ✅ Shows captions and links to Instagram
- ✅ Graceful fallback if API is not configured
- ✅ Cached for 1 hour (updates automatically)

### Alternative: Public Instagram Profile

If you don't want to set up the full OAuth flow, you can:

1. Use a third-party service like RapidAPI's Instagram API
2. Manually update posts via a JSON file (similar to videos)
3. Use Instagram's public RSS feed (limited functionality)

## Troubleshooting

### YouTube Videos Not Playing

- Ensure the `videoId` is correct in `data/videos.json`
- Check browser console for errors
- Verify YouTube IFrame API is loading (check Network tab)

### Instagram Photos Not Showing

- Verify `INSTAGRAM_ACCESS_TOKEN` is set correctly
- Check that the token hasn't expired (Instagram tokens expire)
- Look at server logs for API errors
- The page will show a message if no posts are available

### Image Loading Issues

- Ensure `next.config.mjs` includes the correct remote image patterns
- Check that Instagram CDN domains are allowed
- Verify image URLs are accessible

## Notes

- Instagram access tokens expire. You may need to refresh them periodically or set up token refresh logic.
- YouTube videos use the official IFrame API, so all standard YouTube features work (including view counting).
- Both sections gracefully handle missing data and show appropriate messages.

