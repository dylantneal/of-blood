import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import archiver from "archiver";
import NodeID3 from "node-id3";
import { Release } from "@/lib/types";

// Force Node.js runtime (not Edge) - required for fs operations
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Load releases data
const releasesData = require("@/data/releases.json") as Release[];

// Band information for metadata
const BAND_INFO = {
  artist: "Of Blood",
  albumArtist: "Of Blood",
  copyright: `℗ & © ${new Date().getFullYear()} Of Blood. All rights reserved.`,
  publisher: "Of Blood",
  genre: "Death Metal",
  website: "https://of-blood.com",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ releaseId: string }> }
) {
  try {
    const { releaseId } = await params;

    // Find the release
    const release = releasesData.find((r: Release) => r.id === releaseId);
    if (!release) {
      return NextResponse.json(
        { error: "Release not found" },
        { status: 404 }
      );
    }

    // Get tracks with audio
    const tracksWithAudio = release.tracks?.filter((t) => t.audioUrl) || [];
    if (tracksWithAudio.length === 0) {
      return NextResponse.json(
        { error: "No downloadable tracks available" },
        { status: 404 }
      );
    }

    // Get release year
    const releaseYear = new Date(release.date).getFullYear();
    
    // Sanitize folder name for the ZIP
    const folderName = `Of Blood - ${release.title} (${releaseYear})`
      .replace(/[<>:"/\\|?*]/g, "")
      .trim();

    // Read album cover if available
    let albumCoverBuffer: Buffer | null = null;
    if (release.cover) {
      const coverPath = path.join(process.cwd(), "public", release.cover);
      if (fs.existsSync(coverPath)) {
        albumCoverBuffer = fs.readFileSync(coverPath);
      }
    }

    // Create archive
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    // Collect all data into a buffer
    const chunks: Uint8Array[] = [];
    
    await new Promise<void>((resolve, reject) => {
      archive.on("data", (chunk: Uint8Array) => {
        chunks.push(chunk);
      });
      
      archive.on("end", () => {
        resolve();
      });
      
      archive.on("error", (err: Error) => {
        reject(err);
      });

      // Add cover to ZIP
      if (albumCoverBuffer) {
        archive.append(albumCoverBuffer, { name: `${folderName}/cover.png` });
      }

      // Process each track
      for (let i = 0; i < tracksWithAudio.length; i++) {
        const track = tracksWithAudio[i];
        if (!track.audioUrl) continue;

        // Read original audio file
        const audioPath = path.join(process.cwd(), "public", track.audioUrl);
        if (!fs.existsSync(audioPath)) {
          console.warn(`Audio file not found: ${audioPath}`);
          continue;
        }

        const audioBuffer = fs.readFileSync(audioPath);

        // Create ID3 tags
        const tags: NodeID3.Tags = {
          title: track.title,
          artist: BAND_INFO.artist,
          album: release.title,
          year: releaseYear.toString(),
          trackNumber: String(track.n || i + 1),
          genre: BAND_INFO.genre,
          copyright: BAND_INFO.copyright,
          publisher: BAND_INFO.publisher,
          performerInfo: BAND_INFO.albumArtist,
          originalArtist: BAND_INFO.artist,
          encodedBy: "Of Blood Official",
          comment: {
            language: "eng",
            text: `Official Release - ${release.description || `From the ${release.type.toLowerCase()} "${release.title}" by Of Blood.`}`,
          },
        };

        // Add album art to tags if available
        if (albumCoverBuffer) {
          tags.image = {
            mime: "image/png",
            type: { id: 3, name: "Front Cover" },
            description: "Album Cover",
            imageBuffer: albumCoverBuffer,
          };
        }

        // Write ID3 tags to buffer
        const taggedBuffer = NodeID3.write(tags, audioBuffer);

        // Create filename with track number
        const trackNum = String(track.n || i + 1).padStart(2, "0");
        const sanitizedTitle = track.title.replace(/[<>:"/\\|?*]/g, "").trim();
        const filename = `${trackNum} - ${sanitizedTitle}.mp3`;

        // Add to archive
        archive.append(taggedBuffer, { name: `${folderName}/${filename}` });
      }

      // Create credits/info text file
      const creditsContent = generateCreditsFile(release, releaseYear);
      archive.append(creditsContent, { name: `${folderName}/INFO.txt` });

      // Finalize
      archive.finalize();
    });

    // Combine chunks
    const zipBuffer = Buffer.concat(chunks);

    // Create filename for download
    const downloadFilename = `${folderName}.zip`;

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(downloadFilename)}"`,
        "Content-Length": zipBuffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to generate download", details: String(error) },
      { status: 500 }
    );
  }
}

function generateCreditsFile(release: Release, year: number): string {
  const tracks = release.tracks || [];
  const trackList = tracks
    .map((t, i) => {
      const num = String(t.n || i + 1).padStart(2, "0");
      const duration = t.duration ? formatDuration(t.duration) : "";
      return `${num}. ${t.title}${duration ? ` (${duration})` : ""}`;
    })
    .join("\n");

  return `═══════════════════════════════════════════════════════════════
                           OF BLOOD
═══════════════════════════════════════════════════════════════

${release.title}
${release.type} • ${year}

───────────────────────────────────────────────────────────────
TRACKLIST
───────────────────────────────────────────────────────────────

${trackList}

───────────────────────────────────────────────────────────────
ABOUT THIS RELEASE
───────────────────────────────────────────────────────────────

${release.description || ""}

───────────────────────────────────────────────────────────────
CREDITS
───────────────────────────────────────────────────────────────

All music written and performed by Of Blood

───────────────────────────────────────────────────────────────
CONNECT
───────────────────────────────────────────────────────────────

Official Website: https://of-blood.com
Bandcamp: https://ofblood.bandcamp.com
YouTube: https://www.youtube.com/@OfBloodBand

───────────────────────────────────────────────────────────────
LEGAL
───────────────────────────────────────────────────────────────

℗ & © ${year} Of Blood. All rights reserved.

This download is provided for personal use only. 
Unauthorized distribution, reproduction, or commercial use 
is strictly prohibited.

Thank you for supporting Of Blood.

═══════════════════════════════════════════════════════════════
`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
