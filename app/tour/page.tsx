import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { MapPin, Calendar, Camera, PlayCircle, ArrowUpRight, Clock, Users, ExternalLink } from "lucide-react";
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

function extractYouTubeStartSeconds(videoUrl: string): number | null {
  // Supports t=121s, t=121, t=2m1s, and start=121 URL params
  const match = videoUrl.match(/[?&](?:t|start)=([0-9hms]+)/);
  if (!match) return null;

  const value = match[1];
  if (/^\d+$/.test(value)) return parseInt(value, 10);

  const parts = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!parts) return null;
  const seconds =
    (parseInt(parts[1] || "0", 10) * 3600) +
    (parseInt(parts[2] || "0", 10) * 60) +
    parseInt(parts[3] || "0", 10);
  return seconds > 0 ? seconds : null;
}

function getYouTubeEmbedUrl(videoUrl: string): string | null {
  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) return null;

  const start = extractYouTubeStartSeconds(videoUrl);
  return `https://www.youtube.com/embed/${videoId}?rel=0${start ? `&start=${start}` : ""}`;
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
          </div>

          {upcomingShows.length > 0 ? (
            <div className="space-y-8">
              {upcomingShows.map((show) => (
                <article
                  key={show.id}
                  className="group relative overflow-hidden"
                >
                  {/* Dramatic background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Animated border glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-gold/20 to-primary/20 blur-xl" />
                      </div>
                  
                  {/* Main card content */}
                  <div className="relative border border-line/60 bg-gradient-to-br from-muted/50 via-background to-muted/30 backdrop-blur-sm group-hover:border-primary/40 transition-all duration-500">
                    
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
                    
                    {/* Flier Image (if available) */}
                    {show.flierUrl && (
                      <div className="relative aspect-[16/9] w-full border-b border-line/40 overflow-hidden">
                        <Image
                          src={show.flierUrl}
                          alt={`${show.venue} show flier`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      </div>
                    )}

                    <div className="p-8 md:p-10 space-y-8">
                      {/* Header section with date badge */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="space-y-4">
                          {/* Date badge - dramatic styling */}
                          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 backdrop-blur-sm">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="font-mono text-lg text-primary font-bold tracking-wide">
                          {formatShowDate(show.date)}
                            </span>
                        </div>
                          
                          {/* City heading - large and dramatic */}
                        <div>
                            <h3 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
                            {show.city}
                              {show.state && (
                                <span className="text-foreground/50">, {show.state}</span>
                              )}
                          </h3>
                          </div>
                        </div>

                        {/* Ticket button - prominent placement */}
                        {show.ticketUrl && (
                          <div className="flex-shrink-0">
                            {show.isSoldOut ? (
                              <div className="px-8 py-4 bg-muted/80 border border-line text-foreground/50 text-sm font-bold tracking-[0.3em] uppercase text-center">
                                Sold Out
                              </div>
                            ) : show.onSale ? (
                              <a
                                href={show.ticketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white font-bold text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(185,0,0,0.4)] hover:scale-[1.02]"
                              >
                                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                <span className="relative">Get Tickets</span>
                                <ArrowUpRight className="w-5 h-5 relative transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                              </a>
                            ) : (
                              <div className="px-8 py-4 border-2 border-gold/60 text-gold text-sm font-bold tracking-[0.3em] uppercase text-center bg-gold/5">
                                On Sale Soon
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Venue and details grid */}
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left column - Venue info */}
                        <div className="space-y-6">
                          {/* Venue */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold/80">
                              <MapPin className="w-4 h-4" />
                              Venue
                            </div>
                            <div className="pl-6 space-y-1">
                              <p className="text-xl font-semibold text-foreground">
                                {show.venue}
                              </p>
                              {show.address && (
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(show.address)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-foreground/60 hover:text-gold transition-colors group/link"
                                >
                                  <span>{show.address}</span>
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Times */}
                          {(show.doorsTime || show.startTime) && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold/80">
                                <Clock className="w-4 h-4" />
                                Schedule
                              </div>
                              <div className="pl-6 flex flex-wrap gap-x-8 gap-y-2">
                                {show.doorsTime && (
                                  <div>
                                    <span className="text-foreground/50 text-sm">Doors</span>
                                    <p className="text-lg font-semibold text-foreground">{show.doorsTime}</p>
                                  </div>
                                )}
                                {show.startTime && (
                                  <div>
                                    <span className="text-foreground/50 text-sm">Show</span>
                                    <p className="text-lg font-semibold text-foreground">
                                      {show.startTime}
                                      {show.endTime && <span className="text-foreground/60"> – {show.endTime}</span>}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right column - Lineup */}
                        {show.lineup && show.lineup.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold/80">
                              <Users className="w-4 h-4" />
                              Lineup
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {show.lineup.map((act, index) => (
                                act.url ? (
                                  <a
                                    key={index}
                                    href={act.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm transition-all duration-300 ${
                                      act.name === "Of Blood"
                                        ? "bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/50 text-primary font-bold hover:border-primary hover:shadow-[0_0_20px_rgba(185,0,0,0.3)]"
                                        : "border border-line/60 text-foreground/80 hover:border-gold/50 hover:text-gold hover:bg-gold/5"
                                    }`}
                                  >
                                    {act.name}
                                    {act.name !== "Of Blood" && <ExternalLink className="w-3.5 h-3.5 opacity-60" />}
                                  </a>
                                ) : (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center px-4 py-2.5 text-sm ${
                                      act.name === "Of Blood"
                                        ? "bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/50 text-primary font-bold"
                                        : "border border-line/60 text-foreground/80"
                                    }`}
                                  >
                                    {act.name}
                                  </span>
                                )
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                    </div>
                  </article>
              ))}
            </div>
          ) : (
            <div className="p-10 border border-dashed border-line/70 text-center space-y-4">
              <p className="font-display text-2xl text-foreground/90">No shows announced yet</p>
              <Button variant="primary" asChild>
                <Link href="/#newsletter">Join Newsletter</Link>
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
        <Section className="pt-16 pb-32">
          <Container size="narrow">
            <div className="text-center mb-12 space-y-3">
<p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Show Archive</p>
            <h2 className="font-display text-4xl font-semibold">Past Shows</h2>
            </div>

            <div className="space-y-8">
                {pastShows.map((show) => {
                  const mediaItems = show.media ?? [];
                  const hasMedia = mediaItems.length > 0;

                  return (
                  <article
                    key={show.id}
                    className="group relative overflow-hidden"
                  >
                    {/* Subtle background gradient for past shows */}
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Main card content */}
                    <div className="relative border border-line/40 bg-gradient-to-br from-muted/30 via-background to-muted/20 backdrop-blur-sm group-hover:border-line/60 transition-all duration-500">
                      
                      {/* Top accent line - muted for past shows */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

                      <div className="p-8 md:p-10 space-y-8">
                        {/* Header section */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                          <div className="space-y-4">
                            {/* Date badge - muted styling for past shows */}
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-foreground/5 border border-line/40">
                              <Calendar className="w-5 h-5 text-foreground/50" />
                              <span className="font-mono text-lg text-foreground/70 font-medium tracking-wide">
                              {formatShowDate(show.date)}
                              </span>
                          </div>

                            {/* City heading with strikethrough */}
                            <div>
                              <div className="relative inline-block">
                                <h3 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground/70">
                                  {show.city}
                                  {show.state && (
                                    <span className="text-foreground/40">, {show.state}</span>
                                  )}
                                </h3>
                                {/* Red strikethrough line */}
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute inset-x-0 top-1/2 z-10"
                                  style={{
                                    height: "3px",
                                    transform: "translateY(-50%) skewY(-4deg)",
                                    backgroundImage:
                                      "linear-gradient(90deg, rgba(185,0,0,0) 0%, rgba(185,0,0,0.5) 15%, rgba(185,0,0,0.9) 50%, rgba(185,0,0,0.5) 85%, rgba(185,0,0,0) 100%)",
                                    boxShadow: "0 0 14px rgba(185,0,0,0.45)",
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Completed badge */}
                          <div className="flex-shrink-0">
                            <div className="inline-flex items-center gap-2 px-6 py-3 border border-line/40 text-foreground/40 text-xs font-bold tracking-[0.3em] uppercase">
                              <span className="w-2 h-2 rounded-full bg-foreground/30" />
                              Completed
                            </div>
                          </div>
                        </div>

                        {/* Venue info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/40">
                            <MapPin className="w-4 h-4" />
                            Venue
                          </div>
                          <div className="pl-6">
                            <p className="text-xl font-semibold text-foreground/70">
                              {show.venue}
                            </p>
                            {show.address && (
                              <p className="text-foreground/50 mt-1">{show.address}</p>
                            )}
                          </div>
                        </div>

                        {/* Lineup */}
                        {show.lineup && show.lineup.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/40">
                              <Users className="w-4 h-4" />
                              Lineup
                            </div>
                            <div className="pl-6 flex flex-wrap gap-3">
                              {show.lineup.map((act, index) => (
                                act.url ? (
                                  <a
                                    key={index}
                                    href={act.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                      act.name === "Of Blood"
                                        ? "border border-primary/30 text-primary/80 font-semibold hover:border-primary/60 hover:text-primary"
                                        : "border border-line/40 text-foreground/60 hover:border-gold/40 hover:text-gold"
                                    }`}
                                  >
                                    {act.name}
                                    {act.name !== "Of Blood" && <ExternalLink className="w-3.5 h-3.5 opacity-50" />}
                                  </a>
                                ) : (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center px-4 py-2 text-sm ${
                                      act.name === "Of Blood"
                                        ? "border border-primary/30 text-primary/80 font-semibold"
                                        : "border border-line/40 text-foreground/60"
                                    }`}
                                  >
                                    {act.name}
                                  </span>
                                )
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Media section */}
                        {hasMedia && (
                          <div className="pt-8 border-t border-line/30 space-y-6">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold/70">
                              <Camera className="w-4 h-4" />
                              Recap
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                              {mediaItems.map((item, index) => {
                                if (item.type === "image") {
                                  return (
                                    <figure
                                      key={`${show.id}-media-${index}`}
                                      className="space-y-3"
                                    >
                                      <div className="relative aspect-video border border-line/30 bg-black/60 overflow-hidden group/media">
                                        <Image
                                          src={item.url}
                                          alt={item.caption || `${show.city} performance photo`}
                                          fill
                                          sizes="(min-width: 768px) 50vw, 100vw"
                                          className="object-cover transition-transform duration-700 group-hover/media:scale-105"
                                        />
                                      </div>
                                      {(item.title || item.caption) && (
                                        <figcaption className="text-sm text-foreground/60">
                                          <span className="font-semibold text-foreground/80">
                                            {item.title}
                                          </span>
                                          {item.caption && (
                                            <span className="ml-1">{item.caption}</span>
                                          )}
                                        </figcaption>
                                      )}
                                    </figure>
                                  );
                                }

                                if (item.type === "youtube") {
                                  const embedUrl = getYouTubeEmbedUrl(item.url);
                                  const watchUrl = getYouTubeWatchUrl(item.url);

                                  return (
                                    <div
                                      key={`${show.id}-media-${index}`}
                                      className="space-y-3"
                                    >
                                      <div className="relative aspect-video border border-line/30 overflow-hidden bg-black">
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
                                      </div>
                                      <div className="flex items-center justify-between text-sm">
                                        <div>
                                          <p className="font-semibold text-foreground/80">
                                            {item.title || "Live Footage"}
                                          </p>
                                          {item.caption && (
                                            <p className="text-foreground/50">{item.caption}</p>
                                          )}
                                        </div>
                                        {watchUrl && (
                                          <a
                                            href={watchUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-foreground/50 hover:text-gold transition-colors"
                                          >
                                            Watch
                                            <ArrowUpRight className="w-4 h-4" />
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
                      
                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                      </div>
                    </article>
                  );
                })}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
