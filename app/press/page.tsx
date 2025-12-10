import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PressAssetCard } from "@/components/press/press-asset-card";
import { YouTubeVideoCard } from "@/components/media/youtube-video-card";
import { AnimatedBackground } from "@/components/home/animated-background";
import { 
  Mail, 
  MapPin, 
  Music2, 
  Music,
  Instagram, 
  Youtube,
  ExternalLink,
  Calendar,
  Users,
  Play
} from "lucide-react";

// Videos for the press kit
const pressVideos = [
  {
    id: "1",
    videoId: "AuMok7YqgZE",
    title: "Of Blood - Tendrils Of Descending Divinity (Studio Session)",
    description: "Tendrils Of Descending Divinity, recorded at Smash Studios in Chicago, IL."
  },
  {
    id: "2",
    videoId: "BNCoWC7yVgU",
    title: "Of Blood - Primordial Terror: Live at Label808",
    description: "Primordial Terror, live at Label808 in Chicago, IL."
  }
];

export const metadata: Metadata = {
  title: "Press Kit",
  description: "Press kit and promotional materials for Of Blood. Booking, press, and media inquiries.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PressPage() {
  return (
    <div className="relative">
      {/* Full-page animated background - Multi-layered */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0d0508] to-black" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-50">
          <AnimatedBackground />
        </div>
        
        {/* Floating glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-1/3 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Animated gradient overlay that shifts */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(45deg, rgba(179,10,10,0.1) 0%, transparent 50%, rgba(201,162,39,0.05) 100%)',
            animation: 'gradient-shift 15s ease infinite',
          }}
        />
        
        {/* Scan lines effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />
        
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.8)_100%)]" />
        
        {/* Top and bottom fade for content readability */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Floating decorative elements */}
      <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
        {/* Floating symbols */}
        <div className="absolute top-[20%] right-[10%] w-16 h-16 opacity-[0.03] animate-float">
          <Image src="/images/logos/OfBloodSymbol.png" alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-[60%] left-[5%] w-12 h-12 opacity-[0.02] animate-float" style={{ animationDelay: '3s' }}>
          <Image src="/images/logos/OfBloodSymbol.png" alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-[40%] right-[5%] w-20 h-20 opacity-[0.02] animate-float" style={{ animationDelay: '5s' }}>
          <Image src="/images/logos/OfBloodSymbol.png" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* Hero */}
      <Section className="!pt-32 !pb-20 relative overflow-hidden">
        {/* Hero glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
        
        <Container size="narrow" className="text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-gold/50 to-gold animate-pulse" />
            <div className="w-3 h-3 border-2 border-gold rotate-45 animate-pulse" />
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-gold/50 to-gold animate-pulse" />
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 relative">
            <span className="relative z-10 glow-red">Press Kit</span>
            {/* Text glow layers */}
            <span className="absolute inset-0 blur-2xl text-primary opacity-50 -z-10">Press Kit</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gold font-display tracking-[0.3em] mb-8 animate-pulse">
            FOR PROMOTERS & MEDIA
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-gold/50 to-gold animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-2 h-2 border border-gold rotate-45 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-gold/50 to-gold animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 animate-bounce opacity-50">
            <div className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent" />
            <div className="w-2 h-2 border border-gold/50 rotate-45" />
          </div>
        </Container>
      </Section>

      {/* Band Photo Hero */}
      <Section className="!pt-0 !pb-16 relative">
        <Container>
          <div className="relative group">
            {/* Glow effect behind photo */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-700" />
            
            {/* Outer decorative frame */}
            <div className="relative p-1 bg-gradient-to-br from-gold/30 via-transparent to-gold/30">
              <div className="relative aspect-[3/2] w-full border border-gold/30 overflow-hidden shadow-2xl shadow-black/80">
                <Image
                  src="/images/photos/OfBloodBandPhoto.png"
                  alt="Of Blood - Band Photo"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold transition-all duration-300 group-hover:w-20 group-hover:h-20" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold transition-all duration-300 group-hover:w-20 group-hover:h-20" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold transition-all duration-300 group-hover:w-20 group-hover:h-20" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold transition-all duration-300 group-hover:w-20 group-hover:h-20" />
                
                {/* Center accent lines */}
                <div className="absolute top-1/2 left-0 w-8 h-px bg-gradient-to-r from-gold/50 to-transparent" />
                <div className="absolute top-1/2 right-0 w-8 h-px bg-gradient-to-l from-gold/50 to-transparent" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Quick Facts */}
      <Section className="bg-muted/20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-background/50 border-gold/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  <CardTitle className="text-lg font-display">Location</CardTitle>
                </div>
                <p className="text-foreground/80">Chicago, IL</p>
              </CardContent>
            </Card>

            <Card className="bg-background/50 border-gold/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Music2 className="w-5 h-5 text-gold" />
                  <CardTitle className="text-lg font-display">Genre</CardTitle>
                </div>
                <p className="text-foreground/80">Cosmic Death Metal</p>
              </CardContent>
            </Card>

            <Card className="bg-background/50 border-gold/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  <CardTitle className="text-lg font-display">Formed</CardTitle>
                </div>
                <p className="text-foreground/80">2025</p>
              </CardContent>
            </Card>

            <Card className="bg-background/50 border-gold/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-gold" />
                  <CardTitle className="text-lg font-display">Status</CardTitle>
                </div>
                <p className="text-foreground/80">Active & Touring</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Bio Section */}
      <Section>
        <Container size="narrow">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              About Of Blood
            </h2>
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 md:w-64 md:h-64 opacity-60">
                <Image
                  src="/images/logos/OfBloodLogo.png"
                  alt="Of Blood Logo"
                  width={256}
                  height={256}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 text-foreground/90 leading-relaxed max-w-3xl mx-auto">
            <p className="text-xl">
              <span className="text-gold font-display text-2xl">Of Blood</span> is a Chicago metal band that scores the death of creation. We channel the weight of extinction, the moment humanity faced oblivion and understood what truly mattered.
            </p>

            <p className="text-lg">
              Our sound traverses collapsing stars, eternal ruin, and human extinction; dragging light through the shades where atmosphere, rage, and awe collapse into something vast and visceral.
            </p>

            <div className="border-t border-b border-line/30 py-6 my-6">
              <p className="text-center text-lg italic text-gold font-display">
                "From the clouds descended a mass, a force, a being that felt nothing for the lives below it. It was in one singular instant that we realized we are all family. We are all of blood."
              </p>
            </div>

            <p className="text-lg">
              Of Blood creates a cosmic soundscape that explores existential dread and apocalyptic themes. Our live performances are intense, immersive experiences that bring the ritual to the stage.
            </p>
          </div>
        </Container>
      </Section>

      {/* Music & Releases */}
      <Section className="bg-muted/20 overflow-visible">
        <Container className="overflow-visible">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Music
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Our debut EP is available now.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto overflow-visible">
            {/* Album Art with Pulsing Glow */}
            <div className="relative aspect-square w-full max-w-md mx-auto lg:mx-0 overflow-visible">
              {/* Pulsing red glow */}
              <div 
                className="absolute inset-0 animate-pulse pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(179, 10, 10, 0.7) 0%, rgba(179, 10, 10, 0.35) 45%, transparent 75%)',
                  transform: 'scale(1.6)',
                  filter: 'blur(50px)',
                }}
              />
              
              {/* Album frame */}
              <div className="relative z-10 border-2 border-gold/50 p-3 bg-black/60">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src="/images/releases/InhalingTheEssenceOfAnnihilation.png"
                    alt="Inhaling The Essence of Annihilation - EP Cover"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/80" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/80" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/80" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/80" />
              </div>
            </div>

            {/* Release Details */}
            <div className="space-y-6">
              <div>
                <p className="text-gold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-8 h-px bg-gold/50" />
                  Debut EP • 2025
                </p>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 glow-red">
                  Inhaling The Essence of Annihilation
                </h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  A record that charts humanity&apos;s collapse beneath forces too vast for comprehension—where atmosphere, terror, and awe fuse into something inescapable.
                </p>
              </div>

              {/* Track Listing */}
              <div className="border-t border-b border-line/30 py-6">
                <p className="text-gold text-xs uppercase tracking-widest mb-4">Track Listing</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-foreground/80">
                    <span className="text-gold/60 font-display w-6">01</span>
                    <span>Tendrils of Descending Divinity</span>
                    <span className="text-foreground/40 text-sm ml-auto">3:39</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <span className="text-gold/60 font-display w-6">02</span>
                    <span>In The Stare Of Infinity</span>
                    <span className="text-foreground/40 text-sm ml-auto">2:47</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <span className="text-gold/60 font-display w-6">03</span>
                    <span>This Insurmountable Evil That Hangs Above Us All</span>
                    <span className="text-foreground/40 text-sm ml-auto">3:58</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" asChild>
                  <Link href="/music" className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    Listen on Site
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Videos Section */}
      <Section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        
        <Container className="relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent via-primary/60 to-primary" />
              <div className="relative">
                <Play className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 blur-lg bg-primary/50" />
              </div>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent via-primary/60 to-primary" />
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 glow-red">
              Videos
            </h2>
            
            <p className="text-foreground/60 max-w-2xl mx-auto uppercase tracking-widest text-sm">
              Studio Sessions & Live Performances
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="w-2 h-2 border border-primary/50 rotate-45" />
              <div className="h-px w-24 bg-gradient-to-r from-primary/50 to-transparent" />
              <div className="w-1 h-1 bg-primary/50 rotate-45" />
              <div className="h-px w-24 bg-gradient-to-l from-primary/50 to-transparent" />
              <div className="w-2 h-2 border border-primary/50 rotate-45" />
            </div>
          </div>

          {/* Video Grid with enhanced styling */}
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {pressVideos.map((video) => (
              <div key={video.id} className="relative group">
                {/* Glow effect behind each video */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <YouTubeVideoCard video={video} />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="inline-flex flex-col items-center">
              <div className="h-12 w-px bg-gradient-to-b from-transparent to-gold/50 mb-4" />
              <Button variant="gold" asChild>
                <Link href="/media" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  View All Media
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact & Social */}
      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Info */}
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl font-display flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-wider text-gold mb-2">Booking & Press</p>
                  <a 
                    href="mailto:ofbloodband@gmail.com"
                    className="text-foreground hover:text-primary transition-colors text-lg"
                  >
                    ofbloodband@gmail.com
                  </a>
                </div>
                
                <div className="pt-4 border-t border-line">
                  <Button variant="primary" className="w-full" asChild>
                    <Link href="/contact">Send Inquiry</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-gold/30">
              <CardHeader>
                <CardTitle className="text-2xl font-display">Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a
                    href="https://www.instagram.com/ofbloodband/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-line hover:border-primary/50 hover:bg-primary/5 transition-all rounded-sm group"
                  >
                    <Instagram className="w-5 h-5 text-foreground/70 group-hover:text-primary" />
                    <span className="flex-1">@ofbloodband</span>
                    <ExternalLink className="w-4 h-4 text-foreground/40" />
                  </a>

                  <a
                    href="https://www.youtube.com/@OfBloodBand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-line hover:border-primary/50 hover:bg-primary/5 transition-all rounded-sm group"
                  >
                    <Youtube className="w-5 h-5 text-foreground/70 group-hover:text-primary" />
                    <span className="flex-1">@OfBloodBand</span>
                    <ExternalLink className="w-4 h-4 text-foreground/40" />
                  </a>

                  <a
                    href="https://www.tiktok.com/@ofbloodband"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-line hover:border-primary/50 hover:bg-primary/5 transition-all rounded-sm group"
                  >
                    <Music2 className="w-5 h-5 text-foreground/70 group-hover:text-primary" />
                    <span className="flex-1">@ofbloodband</span>
                    <ExternalLink className="w-4 h-4 text-foreground/40" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Assets & Downloads */}
      <Section className="bg-muted/20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Press Assets
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              High-resolution photos, logos, and promotional materials available for download.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {/* Band Photo */}
            <PressAssetCard
              imageSrc="/images/photos/OfBloodBandPhoto.png"
              alt="Band Photo"
              title="Band Photo"
              description="High-resolution promotional photo"
              downloadFilename="OfBlood-BandPhoto.png"
              aspectRatio="wide"
            />

            {/* Text Logo */}
            <PressAssetCard
              imageSrc="/images/logos/OfBlood_TextLogoTransparent.png"
              alt="Text Logo"
              title="Text Logo"
              description="Transparent PNG logo"
              downloadFilename="OfBlood-TextLogo.png"
              aspectRatio="square"
            />

            {/* Full Logo */}
            <PressAssetCard
              imageSrc="/images/logos/OfBloodLogo.png"
              alt="Of Blood Logo"
              title="Band Logo"
              description="Full logo with symbol and text"
              downloadFilename="OfBlood-Logo.png"
              aspectRatio="square"
            />
          </div>

          <div className="text-center mt-8">
            <p className="text-foreground/60 text-sm mb-4">
              Click the download button on any asset to save it to your device. For high-resolution versions or additional assets, please contact us.
            </p>
            <Button variant="ghost" asChild>
              <Link href="/contact">Request Additional Assets</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Technical Specs */}
      <Section>
        <Container size="narrow">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Technical Information
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-display">Stage Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-foreground/80">
                <p>• 1 Vocal Mic</p>
                <p>• 3 DI's</p>
                <p>• 1 Stage Mic</p>
                <p>• Monitor Mix Preferred</p>
                <p>• 30 Minutes of Set Time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-display">Genre & Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-foreground/80">
                <p>• Cosmic Death Metal</p>
                <p>• Black Metal elements</p>
                <p>• Doom influences</p>
                <p>• Apocalyptic themes</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="relative overflow-hidden">
        {/* Dramatic background */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/30 rounded-full blur-[200px] pointer-events-none" />
        
        <Container size="narrow" className="text-center relative z-10">
          <div className="space-y-8">
            {/* Decorative top element */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-primary/50" />
              <div className="w-3 h-3 border-2 border-primary rotate-45 animate-pulse" />
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold glow-red">
              Ready to Book?
            </h2>
            
            <p className="text-foreground/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We&apos;re actively booking shows and festivals. Get in touch to bring the ritual to your venue.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/contact" className="group">
                  <Mail className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Contact Us
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/tour">
                  <Calendar className="w-5 h-5 mr-2" />
                  View Tour Dates
                </Link>
              </Button>
            </div>
            
            {/* Bottom decorative element */}
            <div className="pt-8 flex items-center justify-center gap-2">
              <div className="w-1 h-1 bg-gold/30 rotate-45" />
              <div className="w-2 h-2 border border-gold/30 rotate-45" />
              <div className="w-1 h-1 bg-gold/30 rotate-45" />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

