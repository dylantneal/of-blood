import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";
import { MapPin, Calendar } from "lucide-react";
import { getShows } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tour Dates",
  description: "Upcoming Of Blood tour dates and shows. Witness the ritual.",
};

export default async function TourPage() {
  const shows = await getShows();
  return (
    <>
      {/* Header */}
      <Section className="pt-32 pb-16">
        <Container size="narrow" className="text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">Tour</h1>
          <p className="text-xl text-foreground/70">
            Witness the ritual. Blood and smoke under stage lights.
          </p>
        </Container>
      </Section>

      {/* Tour Dates */}
      <Section>
        <Container size="narrow">
          {shows.length > 0 ? (
            <div className="space-y-4">
              {shows.map((show) => (
                <div
                  key={show.id}
                  className="group flex flex-col gap-4 p-6 border border-line bg-muted/30 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Date & Location */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-gold font-mono">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(show.date)}</span>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-semibold mb-1 group-hover:text-primary transition-colors">
                          {show.city}{show.state ? `, ${show.state}` : ""}
                        </h3>
                        <div className="flex items-center gap-2 text-foreground/70">
                          <MapPin className="w-4 h-4" />
                          <span>{show.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 sm:items-end">
                      {show.isSoldOut ? (
                        <div className="px-4 py-2 bg-muted border border-line text-foreground/50 text-sm font-medium">
                          SOLD OUT
                        </div>
                      ) : show.onSale ? (
                        <Button variant="primary" asChild>
                          <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                            Get Tickets
                          </a>
                        </Button>
                      ) : (
                        <div className="px-4 py-2 border border-gold text-gold text-sm font-medium">
                          ON SALE SOON
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 md:p-16 border border-line bg-muted/30 text-center">
              <p className="font-display text-3xl md:text-4xl font-semibold mb-3 text-foreground/90">
                No Upcoming Shows
              </p>
              <p className="text-xl text-foreground/70 mb-8">
                Currently Booking
              </p>
              <Button variant="primary" size="lg" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-16 p-8 border border-line bg-primary/5 text-center">
            <h3 className="font-display text-2xl font-semibold mb-3">
              Stay Updated
            </h3>
            <p className="text-foreground/70 mb-6">
              Get notified when we announce new tour dates in your area.
            </p>
            <Button variant="primary" asChild>
              <a href="/#newsletter">Join Newsletter</a>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

