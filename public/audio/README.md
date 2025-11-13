# Audio Files Directory

Place your audio files in this directory. The audio player expects files to be referenced from `/audio/` in the releases data.

## File Format

- **Format**: MP3 is recommended for best browser compatibility
- **Naming**: Use kebab-case (e.g., `tendrils-of-descending-divinity.mp3`)
- **Quality**: 128-192 kbps is a good balance between quality and file size for web streaming

## Example Structure

```
public/
  audio/
    tendrils-of-descending-divinity.mp3
    track-2-name.mp3
    album-track-1.mp3
```

## Adding Audio to Releases

Update `data/releases.json` to include the `audioUrl` field in each track:

```json
{
  "tracks": [
    {
      "n": 1,
      "title": "Track Name",
      "audioUrl": "/audio/track-name.mp3",
      "duration": 240  // Optional: duration in seconds
    }
  ]
}
```

The `duration` field is optional - it will be automatically detected when the audio loads.

