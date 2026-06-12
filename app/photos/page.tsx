import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { InstagramFeed } from "@/components/media/instagram-feed";
import { getInstagramPosts } from "@/lib/data";
import { AnimatedBackground } from "@/components/home/animated-background";

export default async function PhotosPage() {
  const instagramPosts = await getInstagramPosts();

  return (
    <>
      {/* Header */}
      <Section className="relative isolate overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-black" />
        <div className="absolute inset-0 opacity-70 mix-blend-screen pointer-events-none">
          <AnimatedBackground />
        </div>
        <div className="absolute inset-x-0 -top-32 blur-3xl opacity-40 pointer-events-none">
          <div className="mx-auto h-72 w-72 bg-gold/20 rounded-full" />
        </div>
        <Container size="narrow" className="relative z-10 text-center">
          <div className="relative">
            {/* Decorative line above */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            {/* Title with enhanced glow effect */}
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 relative inline-block mt-8">
              <span className="relative z-10">Photos</span>
              {/* Multiple glow layers for depth */}
              <span
                className="absolute inset-0 blur-3xl opacity-50 text-primary -z-10"
                style={{
                  filter: "blur(50px)",
                  textShadow: "0 0 80px rgba(179, 10, 10, 0.8), 0 0 120px rgba(179, 10, 10, 0.5)",
                }}
              >
                Photos
              </span>
              <span
                className="absolute inset-0 blur-2xl opacity-30 text-primary -z-20"
                style={{
                  filter: "blur(30px)",
                }}
              >
                Photos
              </span>
            </h1>

            {/* Decorative line below */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </div>
          <p className="text-base text-foreground/60 max-w-xl mx-auto uppercase tracking-wider mt-3">
            Live Shots and Visual Content
          </p>
        </Container>
      </Section>

      {/* Photos */}
      <Section className="relative pt-4 pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent pointer-events-none" />
        <Container>
          <p className="sr-only">
            Behind-the-scenes moments, live shots, and visual content
          </p>
          <InstagramFeed posts={instagramPosts} />
        </Container>
      </Section>
    </>
  );
}
