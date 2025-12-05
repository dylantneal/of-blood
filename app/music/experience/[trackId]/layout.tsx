import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immersive Experience | Of Blood",
  description: "Experience Of Blood's music with synchronized lyrics and reactive visuals.",
};

export default function ImmersiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout renders children without the main site header/footer
  // The ImmersiveContainer handles its own full-screen layout
  return (
    <div className="immersive-mode">
      {children}
    </div>
  );
}


