import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PressAssetCard } from "@/components/press/press-asset-card";
import { 
  Mail, 
  MapPin, 
  Music2, 
  Disc, 
  Instagram, 
  Youtube, 
  ExternalLink,
  Calendar,
  Users
} from "lucide-react";

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
    <>
      {/* Hero */}
      <Section className="!pt-32 !pb-20 relative">
        <Container size="narrow" className="text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <div className="w-2 h-2 border border-gold rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 glow-red">
            Press Kit
          </h1>
          
          <p className="text-xl text-gold font-display tracking-widest mb-8">
            FOR PROMOTERS & MEDIA
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <div className="w-2 h-2 border border-gold rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </Container>
      </Section>

      {/* Band Photo Hero */}
      <Section className="!pt-0 !pb-16">
        <Container>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10" />
            
            <div className="relative aspect-[21/9] w-full border-2 border-gold/50 overflow-hidden shadow-2xl shadow-black/60">
              <Image
                src="/images/FullBandPhoto.png"
                alt="Of Blood - Full Band Photo"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/80" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gold/80" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-gold/80" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/80" />
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
                <p className="text-foreground/80">Blackened Death Metal</p>
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
                  src="/images/OfBloodLogo.png"
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
              Combining elements of death metal, black metal, and doom, Of Blood creates a cosmic soundscape that explores cosmic horror, existential dread, and apocalyptic themes. Our live performances are intense, immersive experiences that bring the ritual to the stage.
            </p>
          </div>
        </Container>
      </Section>

      {/* Music & Releases */}
      <Section className="bg-muted/20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Music
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Our debut single is available now. More releases coming soon.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-gold/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative aspect-square w-full md:w-48 flex-shrink-0 bg-muted border border-gold/30 flex items-center justify-center">
                    <Disc className="w-16 h-16 text-gold/30" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-gold text-sm uppercase tracking-wider mb-1">
                        Single • 2025
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                        Tendrils of Descending Divinity
                      </h3>
                      <p className="text-foreground/70">
                        Our debut single. A Chicago metal anthem that scores the death of creation—where atmosphere, rage, and awe collapse into something vast and visceral.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary" size="sm" asChild>
                        <a href="https://ofblood.bandcamp.com/track/tendrils-of-descending-divinity" target="_blank" rel="noopener noreferrer">
                          Bandcamp
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="https://www.youtube.com/@OfBloodBand" target="_blank" rel="noopener noreferrer">
                          YouTube
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

                  <a
                    href="https://ofblood.bandcamp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-line hover:border-primary/50 hover:bg-primary/5 transition-all rounded-sm group"
                  >
                    <Disc className="w-5 h-5 text-foreground/70 group-hover:text-primary" />
                    <span className="flex-1">Bandcamp</span>
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
              imageSrc="/images/FullBandPhoto.png"
              alt="Band Photo"
              title="Band Photo"
              description="High-resolution promotional photo"
              downloadFilename="OfBlood-BandPhoto.png"
              aspectRatio="wide"
            />

            {/* Text Logo */}
            <PressAssetCard
              imageSrc="/images/OfBlood_TextLogoTransparent.png"
              alt="Text Logo"
              title="Text Logo"
              description="Transparent PNG logo"
              downloadFilename="OfBlood-TextLogo.png"
              aspectRatio="square"
            />

            {/* Full Logo */}
            <PressAssetCard
              imageSrc="/images/OfBloodLogo.png"
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
                <p>• Standard backline provided</p>
                <p>• 4-6 vocal mics</p>
                <p>• Drum kit (can provide if needed)</p>
                <p>• Monitor mix preferred</p>
                <p>• 30-45 minute set time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-display">Genre & Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-foreground/80">
                <p>• Blackened Death Metal</p>
                <p>• Death Metal foundation</p>
                <p>• Black Metal elements</p>
                <p>• Doom influences</p>
                <p>• Cosmic & apocalyptic themes</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-b from-background to-muted/30">
        <Container size="narrow" className="text-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Ready to Book?
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              We're actively booking shows and festivals. Get in touch to bring the ritual to your venue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/tour">View Tour Dates</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

