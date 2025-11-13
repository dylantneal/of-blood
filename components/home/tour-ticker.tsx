"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";

const upcomingShows = [
  {
    id: "1",
    date: "2025-12-15",
    city: "Los Angeles",
    venue: "The Roxy Theatre",
    ticketUrl: "#",
  },
  {
    id: "2",
    date: "2025-12-18",
    city: "San Francisco",
    venue: "The Fillmore",
    ticketUrl: "#",
  },
  {
    id: "3",
    date: "2025-12-22",
    city: "Portland",
    venue: "Crystal Ballroom",
    ticketUrl: "#",
  },
];

export function TourTicker() {
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
              <Button variant="ghost" asChild>
                <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                  Tickets
                </a>
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="primary" size="lg" asChild>
            <Link href="/tour">View All Dates</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

