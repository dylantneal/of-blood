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

  // Create a new particle
  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const { direction, speed } = theme.particles;
    
    let x: number, y: number, vx: number, vy: number;
    
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

    const maxLife = 200 + Math.random() * 300;
    
    return {
      x,
      y,
      vx,
      vy,
      size: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.7,
      life: maxLife,
      maxLife,
    };
  }, [theme.particles]);

  // Render tendrils (custom particle type)
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
    ctx.fillStyle = "rgba(10, 10, 10, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const effectiveIntensity = getEffectiveIntensity();

    // Render based on particle type
    switch (theme.particles.type) {
      case "tendrils":
        renderTendrils(ctx, canvas, effectiveIntensity);
        break;
      case "none":
      default:
        break;
    }

    // Add ambient glow at center during high intensity
    if (effectiveIntensity > 0.6) {
      const glowIntensity = (effectiveIntensity - 0.6) / 0.4;
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.3, 0,
        canvas.width / 2, canvas.height * 0.3, canvas.width * 0.5
      );
      gradient.addColorStop(0, `${theme.colors.primary}${Math.floor(glowIntensity * 30).toString(16).padStart(2, "0")}`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    rafRef.current = requestAnimationFrame(render);
  }, [theme, getEffectiveIntensity, renderTendrils]);

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

