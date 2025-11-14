import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { YouTubeVideoCard } from "@/components/media/youtube-video-card";
import { InstagramFeed } from "@/components/media/instagram-feed";
import { getYouTubeVideos, getInstagramPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Media",
  description: "Photos, videos, and press materials from Of Blood.",
};

export default async function MediaPage() {
  const videos = await getYouTubeVideos();
  const instagramPosts = await getInstagramPosts();

  // Filter out placeholder videos (videos without a videoId)
  const validVideos = videos.filter((video) => video.videoId && video.videoId.trim() !== "");

  return (
    <>
      {/* Header */}
      <Section className="pt-32 pb-6">
        <Container size="narrow" className="text-center">
          <div className="relative">
            {/* Decorative line above */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            {/* Title with enhanced glow effect */}
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 relative inline-block mt-8">
              <span className="relative z-10">
                Media
              </span>
              {/* Multiple glow layers for depth */}
              <span 
                className="absolute inset-0 blur-3xl opacity-50 text-primary -z-10"
                style={{ 
                  filter: 'blur(50px)',
                  textShadow: '0 0 80px rgba(179, 10, 10, 0.8), 0 0 120px rgba(179, 10, 10, 0.5)'
                }}
              >
                Media
              </span>
              <span 
                className="absolute inset-0 blur-2xl opacity-30 text-primary -z-20"
                style={{ 
                  filter: 'blur(30px)',
                }}
              >
                Media
              </span>
            </h1>
            
            {/* Decorative line below */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          <p className="text-base text-foreground/60 max-w-xl mx-auto uppercase tracking-wider mt-3">
            Videos and Photos
          </p>
        </Container>
      </Section>

      {/* Videos */}
      <Section className="relative pt-4 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <Container>
          <div className="mb-12 relative">
            <div className="flex items-center gap-6 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-primary/60" />
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Videos</h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/40 to-primary/60" />
            </div>
            <p className="text-sm text-foreground/60 text-center max-w-xl mx-auto uppercase tracking-wider">
              Official music videos, live performances, and behind-the-scenes content
            </p>
          </div>
          {validVideos.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {validVideos.map((video) => (
                <YouTubeVideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="p-16 border border-line/50 bg-muted/20 rounded-lg text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />
              <div className="relative z-10">
                <p className="font-display text-xl font-semibold mb-2 text-foreground/90">
                  No Videos Available
                </p>
                <p className="text-foreground/70">
                  Add YouTube videos by editing <code className="bg-muted px-2 py-1 rounded text-sm border border-line/50">data/videos.json</code>
                </p>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Photos */}
      <Section className="relative pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent pointer-events-none" />
        <Container>
          <div className="mb-12 relative">
            <div className="flex items-center gap-6 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/60" />
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Photos</h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/60" />
            </div>
            <p className="text-sm text-foreground/60 text-center max-w-xl mx-auto uppercase tracking-wider">
              Behind-the-scenes moments, live shots, and visual content
            </p>
          </div>
          <InstagramFeed posts={instagramPosts} />
        </Container>
      </Section>
    </>
  );
}
