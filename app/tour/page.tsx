import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { MapPin, Calendar, Camera, PlayCircle, ArrowUpRight } from "lucide-react";
import { AnimatedBackground } from "@/components/home/animated-background";
import { getShows } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tour Dates & Live Shows | Of Blood Cosmic Death Metal Concerts",
  description: "Of Blood tour dates and concert information. Get tickets for upcoming cosmic death metal shows, view past performances, and experience Of Blood live. Check tour schedule and venue details.",
  keywords: [
    "Of Blood tour",
    "Of Blood tour dates",
    "Of Blood concerts",
    "Of Blood live",
    "Of Blood shows",
    "death metal concerts",
    "Of Blood tickets",
    "black metal shows",
    "extreme metal tour"
  ],
  openGraph: {
    title: "Tour Dates | Of Blood",
    description: "Get tickets for upcoming Of Blood cosmic death metal shows. Check tour dates and venue information.",
    url: "https://of-blood.com/tour",
  },
  alternates: {
    canonical: "https://of-blood.com/tour",
  },
};

function toLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map((part) => parseInt(part, 10));
  if (!year || !month || !day) return new Date(dateString);
  return new Date(year, month - 1, day);
}

function formatShowDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(toLocalDate(dateString));
}

function extractYouTubeId(videoUrl: string): string | null {
  if (!videoUrl) return null;

  const idMatch = videoUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/
  );
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }

  const looksLikeId = /^[A-Za-z0-9_-]{6,}$/.test(videoUrl);
  return looksLikeId ? videoUrl : null;
}

function getYouTubeEmbedUrl(videoUrl: string): string | null {
  const videoId = extractYouTubeId(videoUrl);
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
}

function getYouTubeWatchUrl(videoUrl: string): string | null {
  if (!videoUrl) return null;
  if (/^https?:\/\//.test(videoUrl)) return videoUrl;
  const videoId = extractYouTubeId(videoUrl);
  return videoId ? `https://youtu.be/${videoId}` : null;
}

export default async function TourPage() {
  const showsResponse = await getShows();
  const shows = [...showsResponse].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingShows = shows.filter((show) => toLocalDate(show.date) >= today);
  const pastShows = shows
    .filter((show) => toLocalDate(show.date) < today)
    .sort((a, b) => toLocalDate(b.date).getTime() - toLocalDate(a.date).getTime());

  return (
    <>
      <Section className="relative isolate overflow-hidden pt-32 pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-black" />
        <div className="absolute inset-0 opacity-70 mix-blend-screen pointer-events-none">
          <AnimatedBackground />
        </div>
        <Container size="narrow" className="relative z-10 text-center space-y-6">
          <div className="space-y-1">
            <h1 className="font-display text-5xl md:text-7xl font-bold">Tour</h1>
            <p className="text-sm uppercase tracking-[0.35em] text-foreground/60">
              Upcoming dates + show archive
            </p>
          </div>
          <Button variant="primary" size="lg" asChild>
            <a href="#upcoming">View Schedule</a>
          </Button>
        </Container>
      </Section>

      <Section id="upcoming" className="py-20">
        <Container size="narrow" className="space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">
              Upcoming Shows
            </p>
            <h2 className="font-display text-4xl font-semibold">Live Dates</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              {upcomingShows.length > 0
                ? `${upcomingShows.length} ${
                    upcomingShows.length === 1 ? "show" : "shows"
                  } announced.`
                : "More dates coming soon. Sign up for updates."}
            </p>
          </div>

          {upcomingShows.length > 0 ? (
            <div className="space-y-6">
              {upcomingShows.map((show) => {
                const ticketButton = (() => {
                  if (show.isSoldOut) {
                    return (
                      <div className="px-4 py-2 bg-muted border border-line text-foreground/60 text-xs font-semibold tracking-[0.35em] uppercase">
                        Sold Out
                      </div>
                    );
                  }

                  if (show.onSale && show.ticketUrl) {
                    return (
                      <Button variant="primary" size="lg" asChild>
                        <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                          Get Tickets
                        </a>
                      </Button>
                    );
                  }

                  if (show.ticketUrl) {
                    return (
                      <div className="px-4 py-2 border border-gold text-gold text-xs font-semibold tracking-[0.35em] uppercase">
                        On Sale Soon
                      </div>
                    );
                  }

                  return (
                    <Button variant="ghost" size="lg" asChild>
                      <a href="/contact">Booking Inquiry</a>
                    </Button>
                  );
                })();

                return (
                  <article
                    key={show.id}
                    className="flex flex-col gap-6 border border-line bg-muted/30 p-6 sm:p-8 hover:border-primary/60 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center flex-1">
                        <div className="flex items-center gap-2 font-mono text-gold text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatShowDate(show.date)}
                        </div>
                        <div>
                          <h3 className="font-display text-3xl font-semibold">
                            {show.city}
                            {show.state ? `, ${show.state}` : ""}
                          </h3>
                          <p className="flex items-center gap-2 text-foreground/60">
                            <MapPin className="w-4 h-4" />
                            {show.venue}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:items-end min-w-[200px]">
                        {ticketButton}
                        <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
                          {show.isSoldOut
                            ? "Join the list for future dates"
                            : show.onSale
                            ? "Limited availability"
                            : "Details coming soon"}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="p-10 border border-dashed border-line/70 text-center space-y-4">
              <p className="font-display text-2xl text-foreground/90">No shows announced yet</p>
              <Button variant="primary" asChild>
                <a href="/#newsletter">Join Newsletter</a>
              </Button>
              <p className="text-sm text-foreground/60">
                Need to route a date?{" "}
                <a href="/contact" className="text-gold underline-offset-4 hover:underline">
                  Contact our booking team
                </a>
                .
              </p>
            </div>
          )}
        </Container>
      </Section>

      {pastShows.length > 0 && (
        <Section className="pt-6 pb-32 bg-muted/10 border-t border-b border-line/60">
          <Container size="narrow">
            <div className="text-center mb-12 space-y-3">
<p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Show Archive</p>
            <h2 className="font-display text-4xl font-semibold">Past Shows</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Highlights from completed dates. Tap through for photos and fan-shot footage.
              </p>
            </div>

            <div className="relative">
              <div
                className="hidden md:block absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent"
                aria-hidden="true"
              />
              <div className="space-y-10 md:pl-10">
                {pastShows.map((show) => {
                  const mediaItems = show.media ?? [];
                  const hasMedia = mediaItems.length > 0;
                  const mediaCountLabel = hasMedia
                    ? `${mediaItems.length} clip${mediaItems.length === 1 ? "" : "s"}`
                    : null;

                  return (
                    <article key={show.id} className="relative md:pl-8">
                      <div className="hidden md:block absolute left-0 top-8 w-4 h-4 rounded-full border border-primary/40 bg-background shadow-[0_0_20px_rgba(185,0,0,0.45)]" />
                      <div className="group border border-line/70 bg-background/70 p-6 sm:p-8 space-y-6 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
                        <div className="space-y-5">
                          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.35em] text-foreground/60">
                            <span className="flex items-center gap-2 font-mono text-gold tracking-normal text-sm">
                              <Calendar className="w-4 h-4" />
                              {formatShowDate(show.date)}
                            </span>
                            {mediaCountLabel && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-foreground/50">
                                {mediaCountLabel}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-2">
                              <div className="relative inline-block">
                                <h3 className="font-display text-3xl md:text-4xl font-semibold text-foreground relative">
                                  {show.city}
                                  {show.state ? `, ${show.state}` : ""}
                                </h3>
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute inset-x-0 top-1/2 z-10"
                                  style={{
                                    height: "3px",
                                    transform: "translateY(-50%) skewY(-4deg)",
                                    backgroundImage:
                                      "linear-gradient(90deg, rgba(255,0,72,0) 0%, rgba(255,0,72,0.5) 15%, rgba(255,0,72,0.9) 50%, rgba(255,0,72,0.5) 85%, rgba(255,0,72,0) 100%)",
                                    boxShadow: "0 0 14px rgba(255,0,72,0.45)",
                                  }}
                                />
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute inset-x-10 top-1/2 blur opacity-50 z-10"
                                  style={{
                                    height: "6px",
                                    transform: "translateY(-50%) skewY(6deg)",
                                    backgroundImage:
                                      "linear-gradient(100deg, rgba(255,0,72,0.3), rgba(255,120,0,0.2) 70%, rgba(255,0,72,0.25))",
                                  }}
                                />
                              </div>
                              <p className="flex items-center gap-2 text-foreground/65">
                                <MapPin className="w-4 h-4 text-foreground/50" />
                                <span>{show.venue}</span>
                              </p>
                            </div>
                            <div className="text-[11px] uppercase tracking-[0.35em] text-primary/60">
                              Recap highlights
                            </div>
                          </div>
                        </div>

                        {hasMedia && (
                          <div className="pt-6 border-t border-line/40 space-y-4">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-foreground/60">
                              <Camera className="w-4 h-4 text-gold" />
                              Recap Highlights
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                              {mediaItems.map((item, index) => {
                                if (item.type === "image") {
                                  return (
                                    <figure
                                      key={`${show.id}-media-${index}`}
                                      className="space-y-2"
                                    >
                                      <div className="relative aspect-video border border-line bg-black/60 overflow-hidden">
                                        <Image
                                          src={item.url}
                                          alt={item.caption || `${show.city} performance photo`}
                                          fill
                                          sizes="(min-width: 768px) 50vw, 100vw"
                                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                      </div>
                                      {(item.title || item.caption) && (
                                        <figcaption className="text-sm text-foreground/70">
                                          <span className="font-semibold text-foreground">
                                            {item.title}
                                          </span>
                                          {item.caption && (
                                            <span className="ml-1 text-foreground/60">
                                              {item.caption}
                                            </span>
                                          )}
                                        </figcaption>
                                      )}
                                    </figure>
                                  );
                                }

                                if (item.type === "youtube") {
                                  const embedUrl = getYouTubeEmbedUrl(item.url);
                                  const watchUrl = getYouTubeWatchUrl(item.url);

                                  if (item.thumbnail) {
                                    return (
                                      <div
                                        key={`${show.id}-media-${index}`}
                                        className="space-y-2"
                                      >
                                        <a
                                          href={watchUrl || item.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="group relative block aspect-video border border-line overflow-hidden bg-black"
                                        >
                                          <Image
                                            src={item.thumbnail}
                                            alt={item.title || `${show.city} live footage`}
                                            fill
                                            sizes="(min-width: 768px) 50vw, 100vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                          />
                                          <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/20" />
                                          <div className="absolute inset-0 flex items-center justify-center text-gold">
                                            <PlayCircle className="w-12 h-12 drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]" />
                                          </div>
                                        </a>
                                        <div className="flex items-center justify-between text-sm text-foreground/70">
                                          <div>
                                            <p className="font-semibold text-foreground">
                                              {item.title || "Live Footage"}
                                            </p>
                                            {item.caption && (
                                              <p className="text-foreground/60">{item.caption}</p>
                                            )}
                                          </div>
                                          {watchUrl && (
                                            <a
                                              href={watchUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-foreground/60 hover:text-primary transition-colors"
                                            >
                                              Watch
                                              <ArrowUpRight className="w-4 h-4" />
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div
                                      key={`${show.id}-media-${index}`}
                                      className="space-y-2"
                                    >
                                      <div className="relative aspect-video border border-line overflow-hidden bg-black">
                                        {embedUrl ? (
                                          <iframe
                                            src={embedUrl}
                                            title={item.title || `${show.city} live footage`}
                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            loading="lazy"
                                            className="absolute inset-0 h-full w-full"
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center text-foreground/50 text-sm">
                                            Unable to load video
                                          </div>
                                        )}
                                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                                      </div>
                                      <div className="flex items-center justify-between text-sm text-foreground/70">
                                        <div>
                                          <p className="font-semibold text-foreground">
                                            {item.title || "Live Footage"}
                                          </p>
                                          {item.caption && (
                                            <p className="text-foreground/60">{item.caption}</p>
                                          )}
                                        </div>
                                        {watchUrl && (
                                          <a
                                            href={watchUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-foreground/60 hover:text-primary transition-colors"
                                          >
                                            Watch
                                            <PlayCircle className="w-4 h-4" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }

                                return null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
