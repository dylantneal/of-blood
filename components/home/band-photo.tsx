import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function BandPhoto() {
  return (
    <Section className="py-16 md:py-24">
      <Container>
        <div className="relative">
          {/* Pulsing red glow behind frame */}
          <div className="absolute -inset-8 bg-primary/20 blur-3xl animate-pulse -z-10" />
          <div className="absolute -inset-12 bg-primary/10 blur-[60px] -z-10" />
          
          {/* Outer decorative frame */}
          <div className="relative p-3 md:p-4 bg-gradient-to-b from-gold/20 via-gold/5 to-gold/20">
            {/* Outer gold border */}
            <div className="absolute inset-0 border border-gold/40" />
            
            {/* Inner frame with image */}
            <div className="relative bg-black p-1">
              {/* Red inner glow line */}
              <div className="absolute inset-0 border border-primary/50 shadow-[inset_0_0_20px_rgba(179,10,10,0.3)]" />
              
              {/* The image container */}
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src="/images/photos/OfBloodBandPhoto2025.png"
                  alt="Of Blood band members"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
              </div>
            </div>
            
            {/* Ornate corner pieces - Top Left */}
            <div className="absolute -top-2 -left-2 w-16 h-16 md:w-20 md:h-20">
              <div className="absolute top-2 left-2 w-full h-full border-t-2 border-l-2 border-gold" />
              <div className="absolute top-0 left-0 w-3 h-3 bg-gold" />
              <div className="absolute top-4 left-0 w-1 h-8 bg-gradient-to-b from-gold to-transparent" />
              <div className="absolute top-0 left-4 w-8 h-1 bg-gradient-to-r from-gold to-transparent" />
            </div>
            
            {/* Ornate corner pieces - Top Right */}
            <div className="absolute -top-2 -right-2 w-16 h-16 md:w-20 md:h-20">
              <div className="absolute top-2 right-2 w-full h-full border-t-2 border-r-2 border-gold" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-gold" />
              <div className="absolute top-4 right-0 w-1 h-8 bg-gradient-to-b from-gold to-transparent" />
              <div className="absolute top-0 right-4 w-8 h-1 bg-gradient-to-l from-gold to-transparent" />
            </div>
            
            {/* Ornate corner pieces - Bottom Left */}
            <div className="absolute -bottom-2 -left-2 w-16 h-16 md:w-20 md:h-20">
              <div className="absolute bottom-2 left-2 w-full h-full border-b-2 border-l-2 border-gold" />
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-gold" />
              <div className="absolute bottom-4 left-0 w-1 h-8 bg-gradient-to-t from-gold to-transparent" />
              <div className="absolute bottom-0 left-4 w-8 h-1 bg-gradient-to-r from-gold to-transparent" />
            </div>
            
            {/* Ornate corner pieces - Bottom Right */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 md:w-20 md:h-20">
              <div className="absolute bottom-2 right-2 w-full h-full border-b-2 border-r-2 border-gold" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-gold" />
              <div className="absolute bottom-4 right-0 w-1 h-8 bg-gradient-to-t from-gold to-transparent" />
              <div className="absolute bottom-0 right-4 w-8 h-1 bg-gradient-to-l from-gold to-transparent" />
            </div>
            
            {/* Center decorative accents - Top */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold" />
              <div className="w-2 h-2 rotate-45 border border-gold bg-background" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold" />
            </div>
            
            {/* Center decorative accents - Bottom */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold" />
              <div className="w-2 h-2 rotate-45 border border-gold bg-background" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

