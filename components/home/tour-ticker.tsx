import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";
import { getUpcomingShows, getInstagramPosts } from "@/lib/data";

export async function TourTicker() {
  const [upcomingShows, instagramPosts] = await Promise.all([
    getUpcomingShows(),
    getInstagramPosts(),
  ]);
  const hasUpcomingShows = upcomingShows.length > 0;
  const recentImages = hasUpcomingShows ? [] : instagramPosts.slice(0, 3);

  return (
    <Section className="bg-primary/5">
      <Container>
        {hasUpcomingShows ? (
          <>
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Tour Dates</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Catch us live.
              </p>
            </div>

            <div className="space-y-4 mb-12">
              {upcomingShows.map((show) => (
                <div
                  key={show.id}
                  className="group flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-6 border border-line bg-muted/30 hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 flex-1">
                    <div className="font-mono text-gold min-w-[120px]">
                      {formatDate(show.date)}
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                        {show.city}
                      </div>
                      <div className="text-foreground/70">{show.venue}</div>
                    </div>
                  </div>
                  {show.ticketUrl && show.onSale && !show.isSoldOut ? (
                    <Button variant="ghost" asChild>
                      <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                        Tickets
                      </a>
                    </Button>
                  ) : show.isSoldOut ? (
                    <div className="px-4 py-2 bg-muted border border-line text-foreground/50 text-sm font-medium">
                      SOLD OUT
                    </div>
                  ) : (
                    <div className="px-4 py-2 border border-gold text-gold text-sm font-medium">
                      ON SALE SOON
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/tour">View All Dates</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            {recentImages.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentImages.map((post) => (
                  <Link
                    key={post.id}
                    href="/media"
                    className="group relative aspect-[3/4] overflow-hidden border border-line/60 bg-muted/10 hover:border-primary/60 transition-colors"
                  >
                    <Image
                      src={post.mediaUrl}
                      alt="Of Blood media image"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 border border-line bg-muted/30 text-center">
                <p className="font-display text-2xl md:text-3xl font-semibold mb-2 text-foreground/90">
                  No Media Yet
                </p>
                <p className="text-lg text-foreground/70">
                  Add imagery via{" "}
                  <code className="bg-muted px-2 py-1 rounded border border-line/60">
                    data/instagram-posts.json
                  </code>
                  .
                </p>
              </div>
            )}

            <div className="text-center mt-10">
              <Button variant="primary" size="lg" asChild>
                <Link href="/media">View Media Page</Link>
              </Button>
            </div>
          </>
        )}
      </Container>
    </Section>
  );
}

