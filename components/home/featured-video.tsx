import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { YouTubeVideoCard } from "@/components/media/youtube-video-card";
import { getYouTubeVideos } from "@/lib/data";

const FEATURED_VIDEO_ID = "0tNxUVu_VOk"; // Live at Live Wire

export async function FeaturedVideo() {
  const videos = await getYouTubeVideos();
  const featuredVideo =
    videos.find((video) => video.videoId === FEATURED_VIDEO_ID) ??
    videos.find((video) => video.videoId && video.videoId.trim() !== "");

  if (!featuredVideo) return null;

  return (
    <Section className="relative py-8 md:py-12 lg:py-14">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <Container>
        <div className="text-center mb-8">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Live
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <YouTubeVideoCard video={featuredVideo} />
        </div>

        <div className="text-center mt-8">
          <Button variant="primary" size="lg" asChild>
            <Link href="/videos">View All Videos</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
