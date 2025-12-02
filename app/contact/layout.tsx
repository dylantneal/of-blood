import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Booking | Of Blood - Book Shows & Press Inquiries",
  description: "Contact Of Blood for booking inquiries, press requests, and general questions. Get in touch with the blackened death metal band for shows, interviews, and collaborations.",
  keywords: [
    "Of Blood contact",
    "Of Blood booking",
    "Of Blood press",
    "Of Blood email",
    "book Of Blood",
    "Of Blood shows",
    "death metal booking",
    "metal band contact",
    "Of Blood inquiries"
  ],
  openGraph: {
    title: "Contact & Booking | Of Blood",
    description: "Contact Of Blood for booking inquiries, press requests, and general questions.",
    url: "https://of-blood.com/contact",
  },
  alternates: {
    canonical: "https://of-blood.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

