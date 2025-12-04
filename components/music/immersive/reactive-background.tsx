"use client";

import { useRef, useEffect, useCallback } from "react";
import { TrackTheme, AudioAnalysis } from "@/lib/types";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  // Extra properties for specific particle types
  twinklePhase?: number;
  glowIntensity?: number;
};

type ReactiveBackgroundProps = {
  theme: TrackTheme;
  analysis: AudioAnalysis;
  intensity: number;      // 0-1, section-based intensity
  isPlaying: boolean;
};

export function ReactiveBackground({
  theme,
  analysis,
  intensity,
  isPlaying,
}: ReactiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  // Calculate combined intensity (section + audio reactivity)
  const getEffectiveIntensity = useCallback(() => {
    const audioContribution = analysis.overall * theme.particles.audioReactivity;
    const baseIntensity = intensity * (1 - theme.particles.audioReactivity);
    return Math.min(1, baseIntensity + audioContribution);
  }, [analysis.overall, intensity, theme.particles.audioReactivity]);

  // Create a new particle based on type
  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const { direction, speed, type } = theme.particles;
    
    let x: number, y: number, vx: number, vy: number;
    let twinklePhase: number | undefined;
    let glowIntensity: number | undefined;
    
    switch (direction) {
      case "down":
        x = Math.random() * canvas.width;
        y = -20;
        vx = (Math.random() - 0.5) * 0.5;
        vy = (0.5 + Math.random() * 1.5) * speed;
        break;
      case "up":
        x = Math.random() * canvas.width;
        y = canvas.height + 20;
        vx = (Math.random() - 0.5) * 0.5;
        vy = -(0.5 + Math.random() * 1.5) * speed;
        break;
      case "radial":
      default:
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.3;
        x = centerX + Math.cos(angle) * distance;
        y = centerY + Math.sin(angle) * distance;
        vx = Math.cos(angle) * (0.5 + Math.random()) * speed;
        vy = Math.sin(angle) * (0.5 + Math.random()) * speed;
        break;
    }

    // Type-specific initialization
    if (type === "stars") {
      // Stars spawn anywhere on screen
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
      // Very slow radial movement from center (like being watched)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const angle = Math.atan2(y - centerY, x - centerX);
      vx = Math.cos(angle) * speed * 0.2;
      vy = Math.sin(angle) * speed * 0.2;
      twinklePhase = Math.random() * Math.PI * 2;
    } else if (type === "embers") {
      // Embers fall from above with some rising like ash
      x = Math.random() * canvas.width;
      if (Math.random() < 0.7) {
        // Most fall from above
        y = -20;
        vy = (0.3 + Math.random() * 0.8) * speed;
      } else {
        // Some rise from below like ash
        y = canvas.height + 20;
        vy = -(0.2 + Math.random() * 0.5) * speed;
      }
      vx = (Math.random() - 0.5) * 0.8;
      glowIntensity = 0.5 + Math.random() * 0.5;
    }

    const maxLife = type === "stars" ? 400 + Math.random() * 400 : 200 + Math.random() * 300;
    
    return {
      x,
      y,
      vx,
      vy,
      size: type === "stars" ? 0.5 + Math.random() * 2 : 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.7,
      life: maxLife,
      maxLife,
      twinklePhase,
      glowIntensity,
    };
  }, [theme.particles]);

  // Render tendrils (cosmic purple tendrils descending)
  const renderTendrils = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    effectiveIntensity: number
  ) => {
    const { primary, secondary } = theme.colors;
    const particleCount = Math.floor(theme.particles.density * 50 * effectiveIntensity);
    
    // Ensure we have enough particles
    while (particlesRef.current.length < particleCount) {
      particlesRef.current.push(createParticle(canvas));
    }
    
    // Remove excess particles
    while (particlesRef.current.length > particleCount + 10) {
      particlesRef.current.pop();
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      // Update position
      const speedMod = 1 + analysis.bass * 0.5;
      particle.x += particle.vx * speedMod;
      particle.y += particle.vy * speedMod;
      particle.life -= 1;

      // Add slight wobble for organic feel
      particle.x += Math.sin(particle.life * 0.02) * 0.3;

      // Check bounds
      if (
        particle.life <= 0 ||
        particle.x < -50 ||
        particle.x > canvas.width + 50 ||
        particle.y < -50 ||
        particle.y > canvas.height + 50
      ) {
        return false;
      }

      // Calculate opacity based on life
      const lifeRatio = particle.life / particle.maxLife;
      const fadeIn = Math.min(1, (particle.maxLife - particle.life) / 30);
      const fadeOut = lifeRatio < 0.2 ? lifeRatio / 0.2 : 1;
      const currentOpacity = particle.opacity * fadeIn * fadeOut * effectiveIntensity;

      // Draw tendril segment
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      gradient.addColorStop(0, `${primary}${Math.floor(currentOpacity * 255).toString(16).padStart(2, "0")}`);
      gradient.addColorStop(0.5, `${secondary}${Math.floor(currentOpacity * 128).toString(16).padStart(2, "0")}`);
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * (1 + analysis.bass * 0.3), 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw trailing glow
      if (effectiveIntensity > 0.5) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = `${theme.colors.glow.replace(")", `, ${currentOpacity * 0.1})`).replace("rgba", "rgba")}`;
        ctx.fill();
      }

      return true;
    });

    // Spawn new particles
    if (isPlaying && Math.random() < theme.particles.density * effectiveIntensity * 0.3) {
      particlesRef.current.push(createParticle(canvas));
    }
  }, [theme, analysis.bass, createParticle, isPlaying]);

  // Render stars (for "In The Stare Of Infinity" - cosmic eyes watching)
  const renderStars = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    effectiveIntensity: number
  ) => {
    const { primary, secondary, highlight } = theme.colors;
    const particleCount = Math.floor(theme.particles.density * 80);
    
    // Ensure we have enough particles
    while (particlesRef.current.length < particleCount) {
      particlesRef.current.push(createParticle(canvas));
    }
    
    // Remove excess particles
    while (particlesRef.current.length > particleCount + 10) {
      particlesRef.current.pop();
    }

    // Draw a subtle central "eye" effect
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const eyeSize = Math.min(canvas.width, canvas.height) * 0.3 * (1 + analysis.overall * 0.2);
    
    // Outer iris glow
    const irisGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, eyeSize
    );
    irisGradient.addColorStop(0, `rgba(20, 20, 40, ${0.1 + effectiveIntensity * 0.15})`);
    irisGradient.addColorStop(0.5, `rgba(30, 30, 60, ${0.05 + effectiveIntensity * 0.1})`);
    irisGradient.addColorStop(1, "transparent");
    ctx.fillStyle = irisGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw star particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      // Slow movement
      particle.x += particle.vx * (1 + analysis.mids * 0.3);
      particle.y += particle.vy * (1 + analysis.mids * 0.3);
      particle.life -= 0.5;

      // Update twinkle phase
      if (particle.twinklePhase !== undefined) {
        particle.twinklePhase += 0.05 + analysis.highs * 0.1;
      }

      // Check bounds and life
      if (
        particle.life <= 0 ||
        particle.x < -50 ||
        particle.x > canvas.width + 50 ||
        particle.y < -50 ||
        particle.y > canvas.height + 50
      ) {
        return false;
      }

      // Calculate opacity with twinkle effect
      const lifeRatio = particle.life / particle.maxLife;
      const fadeIn = Math.min(1, (particle.maxLife - particle.life) / 50);
      const fadeOut = lifeRatio < 0.2 ? lifeRatio / 0.2 : 1;
      const twinkle = particle.twinklePhase !== undefined 
        ? 0.5 + 0.5 * Math.sin(particle.twinklePhase) 
        : 1;
      const currentOpacity = particle.opacity * fadeIn * fadeOut * twinkle * (0.3 + effectiveIntensity * 0.7);

      // Draw star point
      const starSize = particle.size * (1 + analysis.overall * 0.5);
      
      // Core
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, starSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 200, 220, ${currentOpacity})`;
      ctx.fill();

      // Glow
      const glowGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, starSize * 4
      );
      glowGradient.addColorStop(0, `${highlight}${Math.floor(currentOpacity * 180).toString(16).padStart(2, "0")}`);
      glowGradient.addColorStop(0.5, `${primary}${Math.floor(currentOpacity * 60).toString(16).padStart(2, "0")}`);
      glowGradient.addColorStop(1, "transparent");
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, starSize * 4, 0, Math.PI * 2);
      ctx.fill();

      // On high intensity, draw subtle rays (like watching eyes)
      if (effectiveIntensity > 0.6 && Math.random() < 0.1) {
        ctx.strokeStyle = `rgba(100, 100, 140, ${currentOpacity * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particle.x - starSize * 3, particle.y);
        ctx.lineTo(particle.x + starSize * 3, particle.y);
        ctx.moveTo(particle.x, particle.y - starSize * 3);
        ctx.lineTo(particle.x, particle.y + starSize * 3);
        ctx.stroke();
      }

      return true;
    });

    // Spawn new particles
    if (Math.random() < theme.particles.density * 0.1) {
      particlesRef.current.push(createParticle(canvas));
    }
  }, [theme, analysis, createParticle]);

  // Render embers (for "This Insurmountable Evil" - oppressive falling ash/fire)
  const renderEmbers = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    effectiveIntensity: number
  ) => {
    const { primary, secondary, highlight } = theme.colors;
    const particleCount = Math.floor(theme.particles.density * 60 * effectiveIntensity);
    
    // Ensure we have enough particles
    while (particlesRef.current.length < particleCount) {
      particlesRef.current.push(createParticle(canvas));
    }
    
    // Remove excess particles
    while (particlesRef.current.length > particleCount + 10) {
      particlesRef.current.pop();
    }

    // Draw oppressive overhead glow (the "evil" above)
    const topGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.4);
    topGradient.addColorStop(0, `rgba(80, 0, 0, ${0.1 + effectiveIntensity * 0.15})`);
    topGradient.addColorStop(0.5, `rgba(40, 0, 0, ${0.05 + effectiveIntensity * 0.08})`);
    topGradient.addColorStop(1, "transparent");
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

    // Update and draw ember particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      // Update position with drift
      const speedMod = 1 + analysis.bass * 0.4;
      particle.x += particle.vx * speedMod;
      particle.y += particle.vy * speedMod;
      particle.life -= 1;

      // Add horizontal drift (like particles in wind)
      particle.x += Math.sin(particle.life * 0.01) * 0.5;
      
      // Slight downward pull (gravity)
      if (particle.vy < 0) {
        particle.vy += 0.01; // Rising particles slow down
      }

      // Check bounds
      if (
        particle.life <= 0 ||
        particle.x < -50 ||
        particle.x > canvas.width + 50 ||
        particle.y < -50 ||
        particle.y > canvas.height + 50
      ) {
        return false;
      }

      // Calculate opacity based on life
      const lifeRatio = particle.life / particle.maxLife;
      const fadeIn = Math.min(1, (particle.maxLife - particle.life) / 20);
      const fadeOut = lifeRatio < 0.3 ? lifeRatio / 0.3 : 1;
      const glow = particle.glowIntensity || 1;
      const currentOpacity = particle.opacity * fadeIn * fadeOut * glow * effectiveIntensity;

      // Ember size pulses with bass
      const emberSize = particle.size * (1 + analysis.bass * 0.4);

      // Draw ember core (bright center)
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, emberSize * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `${highlight}${Math.floor(currentOpacity * 255).toString(16).padStart(2, "0")}`;
      ctx.fill();

      // Draw ember glow
      const emberGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, emberSize * 3
      );
      emberGradient.addColorStop(0, `${primary}${Math.floor(currentOpacity * 200).toString(16).padStart(2, "0")}`);
      emberGradient.addColorStop(0.4, `${secondary}${Math.floor(currentOpacity * 100).toString(16).padStart(2, "0")}`);
      emberGradient.addColorStop(1, "transparent");
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, emberSize * 3, 0, Math.PI * 2);
      ctx.fillStyle = emberGradient;
      ctx.fill();

      // Draw trailing smoke for some particles
      if (Math.random() < 0.3 && effectiveIntensity > 0.4) {
        ctx.beginPath();
        ctx.arc(
          particle.x - particle.vx * 3, 
          particle.y - particle.vy * 3, 
          emberSize * 2, 
          0, 
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(30, 10, 10, ${currentOpacity * 0.2})`;
        ctx.fill();
      }

      return true;
    });

    // Spawn new particles
    if (isPlaying && Math.random() < theme.particles.density * effectiveIntensity * 0.4) {
      particlesRef.current.push(createParticle(canvas));
    }
  }, [theme, analysis, createParticle, isPlaying]);

  // Main render loop
  const render = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    // Throttle to ~30fps for efficiency
    const elapsed = timestamp - lastTimeRef.current;
    if (elapsed < 33) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }
    lastTimeRef.current = timestamp;

    // Clear canvas with fade effect for trails
    // Adjust fade based on particle type for different trail lengths
    const fadeOpacity = theme.particles.type === "stars" ? 0.08 : 
                        theme.particles.type === "embers" ? 0.12 : 0.15;
    ctx.fillStyle = `rgba(10, 10, 10, ${fadeOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const effectiveIntensity = getEffectiveIntensity();

    // Render based on particle type
    switch (theme.particles.type) {
      case "tendrils":
        renderTendrils(ctx, canvas, effectiveIntensity);
        break;
      case "stars":
        renderStars(ctx, canvas, effectiveIntensity);
        break;
      case "embers":
        renderEmbers(ctx, canvas, effectiveIntensity);
        break;
      case "none":
      default:
        break;
    }

    // Add ambient glow at center during high intensity
    if (effectiveIntensity > 0.6) {
      const glowIntensity = (effectiveIntensity - 0.6) / 0.4;
      const glowY = theme.particles.type === "embers" ? canvas.height * 0.1 : canvas.height * 0.3;
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, glowY, 0,
        canvas.width / 2, glowY, canvas.width * 0.5
      );
      gradient.addColorStop(0, `${theme.colors.primary}${Math.floor(glowIntensity * 30).toString(16).padStart(2, "0")}`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    rafRef.current = requestAnimationFrame(render);
  }, [theme, getEffectiveIntensity, renderTendrils, renderStars, renderEmbers]);

  // Clear particles when particle type or theme changes
  useEffect(() => {
    // Clear existing particles for fresh start with new theme
    particlesRef.current = [];
    
    // Also clear the canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [theme.particles.type, theme.colors.primary]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Start/stop render loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [render]);

  return (
    <>
      {/* Base gradient background */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: theme.background.gradient }}
      />
      
      {/* Overlay gradient */}
      {theme.background.overlay && (
        <div
          className="fixed inset-0 z-0"
          style={{ background: theme.background.overlay }}
        />
      )}
      
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />
    </>
  );
}
