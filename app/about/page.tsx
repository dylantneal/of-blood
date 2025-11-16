import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "About",
  description: "The story and philosophy behind Of Blood.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section className="!pt-32 !pb-20 relative">
        <Container size="narrow" className="text-center">
          {/* Decorative lines above title */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <div className="w-2 h-2 border border-gold rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 glow-red">About</h1>
          
          <p className="text-xl text-gold font-display tracking-widest mb-8">
            WE ARE ALL FAMILY
          </p>
          
          {/* Decorative lines below subtitle */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <div className="w-2 h-2 border border-gold rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </Container>
      </Section>

      {/* Band Photo */}
      <Section className="!pt-0 !pb-16">
        <Container>
          <div className="relative">
            {/* Glowing effect behind photo */}
            <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10" />
            
            <div className="relative aspect-[21/9] w-full border-2 border-gold/50 overflow-hidden shadow-2xl shadow-black/60">
              <Image
                src="/images/photos/FullBandPhoto.png"
                alt="Of Blood band members"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlays for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
              
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/80" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gold/80" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-gold/80" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/80" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Bio */}
      <Section className="relative">
        <Container size="narrow">
          {/* Decorative symbol divider */}
          <div className="flex justify-center mb-16">
            <div className="relative w-24 h-24 opacity-90">
              <Image
                src="/images/logos/OfBloodSymbol.png"
                alt=""
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(179,10,10,0.4)]"
              />
            </div>
          </div>
          
          <div className="space-y-10 max-w-3xl mx-auto">
            <p className="text-foreground/90 leading-relaxed text-xl">
              From the clouds descended a mass, a force, a being that felt nothing for the lives below it.
            </p>

            <p className="text-foreground/90 leading-relaxed text-xl">
              As it tore through mountains and cities, humanity found itself as a species to be completely 
              hopeless for the first time in its existence. Extinction quickly neared.
            </p>

            <p className="text-foreground/90 leading-relaxed text-xl text-center pt-6">
              It was in one singular instant that we realized we are all family. We are all{" "}
              <strong className="text-primary glow-red whitespace-nowrap">of blood</strong>.
            </p>
          </div>
        </Container>
      </Section>

      {/* Philosophy/Lore */}
      <Section className="bg-muted/20 border-y border-line/50 relative overflow-hidden">
        {/* Background symbol pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-20 left-10 w-32 h-32">
            <Image src="/images/logos/OfBloodSymbol.png" alt="" fill className="object-contain" />
          </div>
          <div className="absolute bottom-20 right-10 w-32 h-32">
            <Image src="/images/logos/OfBloodSymbol.png" alt="" fill className="object-contain" />
          </div>
        </div>
        
        <Container size="narrow" className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              The Philosophy
            </h2>
            <div className="flex justify-center mb-8">
              <div className="w-12 h-12 opacity-40">
                <Image
                  src="/images/logos/OfBloodSymbol.png"
                  alt=""
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-10 text-foreground/90 leading-relaxed max-w-3xl mx-auto">
            <p className="text-xl text-center">
              <span className="text-gold font-display text-2xl block mb-6">Of Blood</span>
              is a Chicago metal band that scores the death of creation. We channel the weight of extinction, 
              the moment humanity faced oblivion and understood what truly mattered.
            </p>
            
            <p className="text-lg text-center border-t border-b border-line/30 py-8">
              Our sound traverses collapsing stars, eternal ruin, and human extinction; dragging light through 
              the shades where atmosphere, rage, and awe collapse into something vast and visceral.
            </p>
          </div>
        </Container>
      </Section>

      {/* Members (optional, can expand later) */}
      <Section>
        <Container size="narrow" className="text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
            The Collective
          </h2>
          
          <div className="max-w-2xl mx-auto space-y-10">
            <p className="text-foreground/80 text-xl leading-relaxed">
              We are many voices, one species. 
              In the face of extinction, we realized the truth: 
              we are all family.
            </p>
            
            <div className="relative py-12">
              <blockquote className="text-gold text-2xl md:text-3xl font-display italic leading-relaxed">
                We are all of blood.
              </blockquote>
            </div>
            
            {/* Closing symbol */}
            <div className="flex justify-center pt-8">
              <div className="w-16 h-16 opacity-50">
                <Image
                  src="/images/logos/OfBloodSymbol.png"
                  alt=""
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

