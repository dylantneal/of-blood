import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { YouTubeVideoCard } from "@/components/media/youtube-video-card";
import { getYouTubeVideos } from "@/lib/data";
import { AnimatedBackground } from "@/components/home/animated-background";

export default async function VideosPage() {
  const videos = await getYouTubeVideos();

  // Filter out placeholder videos (videos without a videoId)
  const validVideos = videos.filter((video) => video.videoId && video.videoId.trim() !== "");

  return (
    <>
      {/* Header */}
      <Section className="relative isolate overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-black" />
        <div className="absolute inset-0 opacity-70 mix-blend-screen pointer-events-none">
          <AnimatedBackground />
        </div>
        <div className="absolute inset-x-0 -top-32 blur-3xl opacity-40 pointer-events-none">
          <div className="mx-auto h-72 w-72 bg-primary/30 rounded-full" />
        </div>
        <Container size="narrow" className="relative z-10 text-center">
          <div className="relative">
            {/* Decorative line above */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            {/* Title with enhanced glow effect */}
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 relative inline-block mt-8">
              <span className="relative z-10">Videos</span>
              {/* Multiple glow layers for depth */}
              <span
                className="absolute inset-0 blur-3xl opacity-50 text-primary -z-10"
                style={{
                  filter: "blur(50px)",
                  textShadow: "0 0 80px rgba(179, 10, 10, 0.8), 0 0 120px rgba(179, 10, 10, 0.5)",
                }}
              >
                Videos
              </span>
              <span
                className="absolute inset-0 blur-2xl opacity-30 text-primary -z-20"
                style={{
                  filter: "blur(30px)",
                }}
              >
                Videos
              </span>
            </h1>

            {/* Decorative line below */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          <p className="text-base text-foreground/60 max-w-xl mx-auto uppercase tracking-wider mt-3">
            Music Videos and Live Performances
          </p>
        </Container>
      </Section>

      {/* Videos */}
      <Section className="relative pt-4 pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <Container>
          <p className="sr-only">
            Official music videos, live performances, and behind-the-scenes content
          </p>
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
    </>
  );
}
