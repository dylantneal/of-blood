import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AnimatedBackground } from "@/components/home/animated-background";

export const metadata: Metadata = {
  title: "About Of Blood | Cosmic Death Metal Band Story & Philosophy",
  description: "Learn about Of Blood, a cosmic death metal band exploring existential dread and the weight of extinction. Discover the philosophy, story, and dark vision behind the music.",
  keywords: [
    "Of Blood band",
    "Of Blood about",
    "Of Blood story",
    "Of Blood members",
    "death metal band about",
    "Of Blood philosophy",
    "cosmic horror metal",
    "Of Blood bio"
  ],
  openGraph: {
    title: "About | Of Blood",
    description: "The story and philosophy behind Of Blood - cosmic death metal exploring existential dread and the weight of extinction.",
    url: "https://of-blood.com/about",
  },
  alternates: {
    canonical: "https://of-blood.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Full-page animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0d0508] to-black" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-50">
          <AnimatedBackground />
        </div>
        
        {/* Floating glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-2/3 right-1/3 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0.8)_100%)]" />
      </div>

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
                    src="/images/photos/OfBloodBandPhoto.png"
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
            
            {/* Band Member Names */}
            <div className="grid grid-cols-5 gap-2 md:gap-4 mt-8 md:mt-10 px-8 md:px-16 lg:px-24">
              {[
                { name: "Dalton", instrument: "Bass" },
                { name: "Sergi", instrument: "Guitar" },
                { name: "Artsiom", instrument: "Drums" },
                { name: "Kevin", instrument: "Guitar" },
                { name: "Dylan", instrument: "Vocals" },
              ].map((member) => (
                <div key={member.name} className="text-center">
                  <p className="font-display text-sm md:text-lg lg:text-xl font-semibold text-white tracking-wide">
                    {member.name}
                  </p>
                  <p className="text-xs md:text-sm lg:text-base text-primary font-medium uppercase tracking-widest mt-1">
                    {member.instrument}
                  </p>
                </div>
              ))}
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
      <Section className="relative overflow-hidden">
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
              is a Chicago death metal band. We write about cosmic annihilation and 
              the moment humanity finally understands what we are to each other.
            </p>
            
            <p className="text-lg text-center py-8">
              Heavy, atmospheric, unrelenting. Death metal with black metal ferocity and doom weight.
            </p>
          </div>
        </Container>
      </Section>

      {/* Closing */}
      <Section>
        <Container size="narrow" className="text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <blockquote className="text-gold text-2xl md:text-3xl font-display italic leading-relaxed">
              We are all of blood.
            </blockquote>
            
            {/* Closing symbol */}
            <div className="flex justify-center pt-4">
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
    </div>
  );
}

