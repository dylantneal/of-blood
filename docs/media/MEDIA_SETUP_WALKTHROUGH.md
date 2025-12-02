# Media Page Setup - Step-by-Step Guide

## Part 1: YouTube Videos Setup

### Step 1.1: Get Your YouTube Video IDs

1. Go to your YouTube video (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
2. Copy the part after `v=` - that's your `videoId` (in this example: `dQw4w9WgXcQ`)
3. You can also get it from the share link: `https://youtu.be/dQw4w9WgXcQ` - the ID is after the last `/`

### Step 1.2: Add Videos to `data/videos.json`

Open `data/videos.json` and replace the placeholder with your actual videos:

```json
[
  {
    "id": "1",
    "videoId": "YOUR_FIRST_VIDEO_ID",
    "title": "Your First Video Title",
    "description": "Optional description"
  },
  {
    "id": "2",
    "videoId": "YOUR_SECOND_VIDEO_ID",
    "title": "Your Second Video Title",
    "description": "Another video description"
  }
]
```

**Example with real video:**
```json
[
  {
    "id": "1",
    "videoId": "dQw4w9WgXcQ",
    "title": "Tendrils of Descending Divinity (Official Music Video)",
    "description": "Our debut single music video"
  },
  {
    "id": "2",
    "videoId": "abc123xyz",
    "title": "Live Performance at The Roxy",
    "description": "Full live set from our show"
  }
]
```

### Step 1.3: Test It Out

1. Save `data/videos.json`
2. Run your dev server: `npm run dev`
3. Navigate to `http://localhost:3000/media`
4. You should see your videos with thumbnails
5. Click a video to open it in a modal with full YouTube player controls

**That's it for YouTube!** The videos will work immediately. Views will count on YouTube when played.

---

## Part 2: Instagram Photos Setup (Optional)

Instagram setup requires creating a Facebook App. This is more involved but only needs to be done once.

### Step 2.1: Create a Facebook App

1. Go to https://developers.facebook.com/
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Consumer"** as the app type
4. Fill in:
   - **App Name**: "Of Blood Website" (or whatever you want)
   - **App Contact Email**: Your email
5. Click **"Create App"**

### Step 2.2: Add Instagram Basic Display

1. In your Facebook App dashboard, click **"Add Product"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. You'll see setup instructions - follow them

### Step 2.3: Configure Instagram Basic Display

1. In the Instagram Basic Display settings:
   - **Valid OAuth Redirect URIs**: Add your site URLs:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - **Deauthorize Callback URL**: Same as above
   - **Data Deletion Request URL**: Same as above

2. Click **"Save Changes"**

### Step 2.4: Add Instagram Test User (for testing)

1. In Instagram Basic Display settings, scroll to **"User Token Generator"**
2. Click **"Add or Remove Instagram Testers"**
3. Add your Instagram account as a tester
4. Go back to **"User Token Generator"**
5. Select your Instagram account
6. Click **"Generate Token"**
7. **Copy this token** - this is your `INSTAGRAM_ACCESS_TOKEN`

### Step 2.5: Get Your User ID (Optional)

The user ID is usually included in the token response, or you can get it from:
- The token response JSON
- Or it will be auto-detected by the code

### Step 2.6: Add Credentials to `.env.local`

1. Create or open `.env.local` in your project root
2. Add these lines:

```bash
INSTAGRAM_ACCESS_TOKEN=your_token_here
INSTAGRAM_USER_ID=your_user_id_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Example:**
```bash
INSTAGRAM_ACCESS_TOKEN=IGQWRN...
INSTAGRAM_USER_ID=17841405309211844
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 2.7: Test Instagram Integration

1. Save `.env.local`
2. Restart your dev server (important for env vars)
3. Navigate to `http://localhost:3000/media`
4. Scroll to the Photos section
5. You should see your 9 most recent Instagram posts!

### Step 2.8: Production Setup

When deploying to production:

1. **Get a Long-Lived Token** (tokens expire after 60 days):
   - Use Facebook's token exchange endpoint
   - Or set up token refresh logic
   - See: https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens

2. **Update `.env.local` in production** (or your hosting platform's env vars):
   ```bash
   INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
   INSTAGRAM_USER_ID=your_user_id
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

---

## Troubleshooting

### YouTube Videos Not Showing

- ✅ Check that `videoId` is correct (no extra spaces)
- ✅ Verify the video is public on YouTube
- ✅ Check browser console for errors
- ✅ Make sure JSON is valid (use a JSON validator)

### Instagram Photos Not Showing

- ✅ Verify `.env.local` has the correct token
- ✅ Restart dev server after adding env vars
- ✅ Check that token hasn't expired (they expire after 60 days)
- ✅ Look at server logs/console for API errors
- ✅ Verify Instagram account is added as a tester in Facebook App

### Images Not Loading

- ✅ Check `next.config.mjs` has the correct remote patterns
- ✅ Verify image URLs are accessible
- ✅ Check browser Network tab for failed requests

---

## Quick Reference

**YouTube Video ID Format:**
- URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short: `https://youtu.be/VIDEO_ID`
- Extract: The part after `v=` or after the last `/`

**Instagram Token:**
- Get from: Facebook App → Instagram Basic Display → User Token Generator
- Expires: After 60 days (get long-lived token for production)

**Files to Edit:**
- `data/videos.json` - Add YouTube videos
- `.env.local` - Add Instagram credentials

**Test URLs:**
- Media page: `http://localhost:3000/media`
- YouTube section: Top of page
- Instagram section: Bottom of page

