"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedHeaderProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export function AnimatedHeader({ title, subtitle, children }: AnimatedHeaderProps) {
  return (
    <div className="text-center relative z-10">
      <motion.h1
        className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
        initial={{ opacity: 0, y: -30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.4, 0.25, 1],
        }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-foreground/60 max-w-xl mx-auto leading-relaxed font-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.3,
          ease: "easeOut",
        }}
      >
        {subtitle}
      </motion.p>

      {children && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.5,
            ease: "easeOut",
          }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

