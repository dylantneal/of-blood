"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { TrackTheme, AudioAnalysis } from "@/lib/types";

type EyeEntity = {
  x: number;
  y: number;
  size: number;
  depth: number; // 0-1, affects opacity and parallax
  blinkPhase: number;
  blinkTimer: number;
  nextBlinkTime: number;
  rotationOffset: number;
  driftX: number;
  driftY: number;
  pupilDilation: number;
};

type EyeEffectProps = {
  theme: TrackTheme;
  analysis: AudioAnalysis;
  intensity: number;
  isPlaying: boolean;
  sectionType?: 'vocal' | 'instrumental';
};

export function EyeEffect({
  theme,
  analysis,
  intensity,
  isPlaying,
}: EyeEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const eyesRef = useRef<EyeEntity[]>([]);
  const starsRef = useRef<{x: number; y: number; size: number; twinkle: number}[]>([]);
  const initializedRef = useRef(false);
  const renderFrameRef = useRef<() => void>(() => {});

  // Initialize eyes and stars
  const initializeEntities = useCallback((canvas: HTMLCanvasElement) => {
    if (initializedRef.current) return;
    
    const eyes: EyeEntity[] = [];
    const stars: {x: number; y: number; size: number; twinkle: number}[] = [];
    
    // Adjust counts based on screen size for performance
    const isMobile = canvas.width < 768;
    const isTablet = canvas.width >= 768 && canvas.width < 1024;
    
    // Fewer eyes on mobile for better performance
    const eyeCount = isMobile ? 20 : isTablet ? 30 : 45;
    const starCount = isMobile ? 100 : isTablet ? 150 : 200;
    
    // Smaller max size on mobile
    const maxEyeSize = isMobile ? 50 : 60;
    
    for (let i = 0; i < eyeCount; i++) {
      const depth = Math.random(); // 0 = far, 1 = close
      const size = 8 + depth * maxEyeSize + Math.random() * (isMobile ? 15 : 30);
      
      eyes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        depth,
        blinkPhase: 0,
        blinkTimer: Math.random() * 15, // Stagger initial blink times
        nextBlinkTime: 8 + Math.random() * 20, // 8-28 seconds between blinks
        rotationOffset: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.3,
        driftY: (Math.random() - 0.5) * 0.2,
        pupilDilation: 0.3 + Math.random() * 0.2,
      });
    }
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * (isMobile ? 1.5 : 2),
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    
    eyesRef.current = eyes;
    starsRef.current = stars;
    initializedRef.current = true;
  }, []);

  // Draw a single eye
  const drawEye = useCallback((
    ctx: CanvasRenderingContext2D,
    eye: EyeEntity,
    time: number,
    audioIntensity: number,
    bassReact: number
  ) => {
    const { x, y, size, depth, blinkPhase, rotationOffset, pupilDilation } = eye;
    
    // Calculate blink state
    let eyeOpenness = 1;
    if (blinkPhase > 0) {
      const blinkProgress = blinkPhase;
      const blinkEased = blinkProgress < 0.5 
        ? 2 * blinkProgress * blinkProgress 
        : 1 - Math.pow(-2 * blinkProgress + 2, 2) / 2;
      eyeOpenness = 1 - Math.sin(blinkEased * Math.PI);
    }
    
    // Depth affects opacity
    const baseOpacity = 0.3 + depth * 0.6;
    const opacity = baseOpacity * eyeOpenness;
    
    if (opacity < 0.05) return; // Skip nearly invisible eyes
    
    // Subtle breathing
    const breathe = Math.sin(time * 0.4 + rotationOffset) * 0.02;
    const currentSize = size * (1 + breathe + bassReact * 0.1 * depth);
    
    // Audio-reactive pupil
    const currentPupilDilation = pupilDilation + audioIntensity * 0.15 + bassReact * 0.1;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, eyeOpenness * 0.5 + 0.5); // Vertical squash for eye shape
    ctx.translate(-x, -y);
    
    // === OUTER GLOW ===
    const glowSize = currentSize * 1.5;
    const glow = ctx.createRadialGradient(x, y, currentSize * 0.3, x, y, glowSize);
    glow.addColorStop(0, `rgba(15, 15, 30, ${opacity * 0.3})`);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, glowSize, 0, Math.PI * 2);
    ctx.fill();
    
    // === SCLERA (dark, not white) ===
    const scleraGrad = ctx.createRadialGradient(x, y, 0, x, y, currentSize);
    scleraGrad.addColorStop(0, `rgba(20, 18, 28, ${opacity * 0.9})`);
    scleraGrad.addColorStop(0.7, `rgba(15, 13, 22, ${opacity * 0.8})`);
    scleraGrad.addColorStop(1, `rgba(8, 8, 15, ${opacity * 0.4})`);
    ctx.fillStyle = scleraGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, currentSize, currentSize * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // === IRIS ===
    const irisSize = currentSize * 0.6;
    const irisGrad = ctx.createRadialGradient(x, y, 0, x, y, irisSize);
    irisGrad.addColorStop(0, `rgba(25, 25, 50, ${opacity})`);
    irisGrad.addColorStop(0.5, `rgba(20, 20, 40, ${opacity * 0.9})`);
    irisGrad.addColorStop(1, `rgba(12, 12, 25, ${opacity * 0.6})`);
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(x, y, irisSize, 0, Math.PI * 2);
    ctx.fill();
    
    // === IRIS TEXTURE (for larger eyes) ===
    if (size > 25) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(time * 0.02 + rotationOffset);
      
      const fiberCount = Math.floor(size / 4);
      for (let i = 0; i < fiberCount; i++) {
        const angle = (i / fiberCount) * Math.PI * 2;
        const innerR = irisSize * (currentPupilDilation + 0.1);
        const outerR = irisSize * 0.9;
        
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR * 0.6);
        ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR * 0.6);
        ctx.strokeStyle = `rgba(35, 30, 55, ${opacity * 0.4})`;
        ctx.lineWidth = size > 40 ? 1.5 : 0.8;
        ctx.stroke();
      }
      ctx.restore();
    }
    
    // === PUPIL - THE VOID ===
    const pupilSize = irisSize * currentPupilDilation;
    const pupilGrad = ctx.createRadialGradient(x, y, 0, x, y, pupilSize);
    pupilGrad.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
    pupilGrad.addColorStop(0.6, `rgba(0, 0, 2, ${opacity * 0.95})`);
    pupilGrad.addColorStop(1, `rgba(5, 5, 12, ${opacity * 0.8})`);
    ctx.fillStyle = pupilGrad;
    ctx.beginPath();
    ctx.arc(x, y, pupilSize, 0, Math.PI * 2);
    ctx.fill();
    
    // === INNER VOID ===
    const innerVoid = ctx.createRadialGradient(x, y, 0, x, y, pupilSize * 0.5);
    innerVoid.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
    innerVoid.addColorStop(1, "transparent");
    ctx.fillStyle = innerVoid;
    ctx.beginPath();
    ctx.arc(x, y, pupilSize * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // === SUBTLE INNER GLOW (something watching) ===
    if (size > 20 && audioIntensity > 0.3) {
      const watchGlow = ctx.createRadialGradient(x, y, 0, x, y, pupilSize * 0.4);
      watchGlow.addColorStop(0, `rgba(50, 40, 70, ${opacity * audioIntensity * 0.15})`);
      watchGlow.addColorStop(1, "transparent");
      ctx.fillStyle = watchGlow;
      ctx.beginPath();
      ctx.arc(x, y, pupilSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      rafRef.current = requestAnimationFrame(() => renderFrameRef.current());
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      rafRef.current = requestAnimationFrame(() => renderFrameRef.current());
      return;
    }

    // Initialize on first render
    initializeEntities(canvas);

    timeRef.current += 0.016;
    const time = timeRef.current;

    // Clear with deep space color
    ctx.fillStyle = "rgb(3, 3, 8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bassReact = analysis.bass * 0.15;
    const midsReact = analysis.mids * 0.1;
    const audioIntensity = analysis.overall;

    // === DRAW STARS (background layer) ===
    starsRef.current.forEach((star) => {
      star.twinkle += 0.02 + midsReact * 0.1;
      const twinkleOpacity = 0.3 + Math.sin(star.twinkle) * 0.3 + audioIntensity * 0.2;
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * (1 + bassReact * 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 180, 220, ${twinkleOpacity})`;
      ctx.fill();
      
      // Star glow
      if (star.size > 1) {
        const starGlow = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 4
        );
        starGlow.addColorStop(0, `rgba(150, 150, 200, ${twinkleOpacity * 0.3})`);
        starGlow.addColorStop(1, "transparent");
        ctx.fillStyle = starGlow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // === NEBULA / COSMIC DUST ===
    const nebulaCount = 5;
    for (let i = 0; i < nebulaCount; i++) {
      const nx = canvas.width * (0.2 + (i * 0.15));
      const ny = canvas.height * (0.3 + Math.sin(i + time * 0.1) * 0.2);
      const nSize = 200 + i * 50;
      
      const nebula = ctx.createRadialGradient(nx, ny, 0, nx, ny, nSize);
      nebula.addColorStop(0, `rgba(20, 15, 35, ${0.1 + intensity * 0.05})`);
      nebula.addColorStop(0.5, `rgba(15, 10, 25, ${0.05 + intensity * 0.03})`);
      nebula.addColorStop(1, "transparent");
      ctx.fillStyle = nebula;
      ctx.beginPath();
      ctx.arc(nx, ny, nSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // === UPDATE AND DRAW EYES ===
    // Sort by depth so far eyes render first
    const sortedEyes = [...eyesRef.current].sort((a, b) => a.depth - b.depth);
    
    sortedEyes.forEach((eye) => {
      // Update blink timing
      eye.blinkTimer += 0.016;
      if (eye.blinkTimer > eye.nextBlinkTime && eye.blinkPhase === 0) {
        eye.blinkPhase = 1;
        eye.blinkTimer = 0;
        eye.nextBlinkTime = 10 + Math.random() * 25; // 10-35 seconds
      }
      
      // Slow blink animation
      if (eye.blinkPhase > 0) {
        eye.blinkPhase -= 0.008; // Very slow blink
        if (eye.blinkPhase < 0) eye.blinkPhase = 0;
      }
      
      // Subtle drift
      eye.x += eye.driftX * (1 + bassReact);
      eye.y += eye.driftY * (1 + bassReact);
      
      // Wrap around screen
      if (eye.x < -eye.size) eye.x = canvas.width + eye.size;
      if (eye.x > canvas.width + eye.size) eye.x = -eye.size;
      if (eye.y < -eye.size) eye.y = canvas.height + eye.size;
      if (eye.y > canvas.height + eye.size) eye.y = -eye.size;
      
      // Draw the eye
      drawEye(ctx, eye, time, audioIntensity, bassReact);
    });

    // === CENTRAL VOID - the deepest darkness at center ===
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const voidSize = Math.min(canvas.width, canvas.height) * 0.3 * (1 + intensity * 0.1);
    
    const centralVoid = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, voidSize
    );
    centralVoid.addColorStop(0, `rgba(0, 0, 0, ${0.4 + intensity * 0.2})`);
    centralVoid.addColorStop(0.5, `rgba(0, 0, 5, ${0.2 + intensity * 0.1})`);
    centralVoid.addColorStop(1, "transparent");
    ctx.fillStyle = centralVoid;
    ctx.beginPath();
    ctx.arc(centerX, centerY, voidSize, 0, Math.PI * 2);
    ctx.fill();

    // === EDGE VIGNETTE ===
    const vignette = ctx.createRadialGradient(
      centerX, centerY, Math.min(canvas.width, canvas.height) * 0.3,
      centerX, centerY, Math.max(canvas.width, canvas.height) * 0.8
    );
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(0.7, "rgba(0, 0, 5, 0.3)");
    vignette.addColorStop(1, "rgba(0, 0, 5, 0.7)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // === FILM GRAIN (subtle) ===
    if (Math.random() > 0.7) {
      for (let i = 0; i < 50; i++) {
        const gx = Math.random() * canvas.width;
        const gy = Math.random() * canvas.height;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.02})`;
        ctx.fillRect(gx, gy, 1, 1);
      }
    }

    rafRef.current = requestAnimationFrame(() => renderFrameRef.current());
  }, [analysis, intensity, isPlaying, initializeEntities, drawEye]);

  useEffect(() => {
    renderFrameRef.current = render;
  }, [render]);

  // Handle canvas resize - reinitialize entities
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializedRef.current = false; // Reinitialize on resize
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Start render loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [render]);

  // Reset entities when track changes
  useEffect(() => {
    initializedRef.current = false;
    eyesRef.current = [];
    starsRef.current = [];
  }, [theme]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
