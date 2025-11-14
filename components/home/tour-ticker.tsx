import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";
import { getUpcomingShows } from "@/lib/data";

export async function TourTicker() {
  const upcomingShows = await getUpcomingShows();
  return (
    <Section className="bg-primary/5 border-y border-line">
      <Container>
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Tour Dates</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Witness the ritual. Blood and smoke under stage lights.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {upcomingShows.length > 0 ? (
            upcomingShows.map((show) => (
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
            ))
          ) : (
            <div className="p-12 border border-line bg-muted/30 text-center">
              <p className="font-display text-2xl md:text-3xl font-semibold mb-2 text-foreground/90">
                No Upcoming Shows
              </p>
              <p className="text-lg text-foreground/70 mb-6">
                Currently Booking
              </p>
              <Button variant="primary" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          )}
        </div>

        {upcomingShows.length > 0 && (
          <div className="text-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/tour">View All Dates</Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}

