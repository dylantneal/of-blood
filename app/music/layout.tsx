import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music",
  description: "Discography of Of Blood. Cosmic death metal releases exploring cosmic horror and apocalyptic themes.",
};

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

