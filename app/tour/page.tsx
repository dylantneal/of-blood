import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";
import { MapPin, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Tour Dates",
  description: "Upcoming Of Blood tour dates and shows. Witness the ritual.",
};

const shows = [
  {
    id: "1",
    date: "2025-12-15",
    city: "Los Angeles",
    state: "CA",
    venue: "The Roxy Theatre",
    ticketUrl: "#",
    onSale: true,
    isSoldOut: false,
  },
  {
    id: "2",
    date: "2025-12-18",
    city: "San Francisco",
    state: "CA",
    venue: "The Fillmore",
    ticketUrl: "#",
    onSale: true,
    isSoldOut: false,
  },
  {
    id: "3",
    date: "2025-12-22",
    city: "Portland",
    state: "OR",
    venue: "Crystal Ballroom",
    ticketUrl: "#",
    onSale: true,
    isSoldOut: false,
  },
  {
    id: "4",
    date: "2025-12-28",
    city: "Seattle",
    state: "WA",
    venue: "The Showbox",
    ticketUrl: "#",
    onSale: false,
    isSoldOut: false,
  },
  {
    id: "5",
    date: "2026-01-05",
    city: "Denver",
    state: "CO",
    venue: "Gothic Theatre",
    ticketUrl: "#",
    onSale: false,
    isSoldOut: false,
  },
];

export default function TourPage() {
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
                        {show.city}, {show.state}
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

