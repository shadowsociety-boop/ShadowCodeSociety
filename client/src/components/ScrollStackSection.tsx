import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface ScrollStackSectionProps {
  children: React.ReactNode;
  index: number;
  totalSections?: number;
  className?: string;
  id?: string;
  badge?: string;
}

export const ScrollStackSection: React.FC<ScrollStackSectionProps> = ({
  children,
  index,
  className = '',
  id,
  badge,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of this container as it leaves the top of the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Calculate subtle scale down and opacity falloff as the user scrolls past this section
  // index === 0 (Hero) or later sections smoothly scale down from 1 to 0.93
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.85, 0.4]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.65]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], [0, 24]);

  return (
    <div
      ref={containerRef}
      id={id}
      className="relative w-full"
      style={{
        // Give each section a solid z-index so incoming sections cleanly stack above earlier ones
        zIndex: index + 10,
      }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          filter: useTransform(brightness, (b) => `brightness(${b})`),
          borderRadius,
        }}
        className={`sticky top-0 w-full overflow-hidden transition-shadow duration-300 ${
          index > 0
            ? 'shadow-[0_-30px_70px_rgba(0,0,0,0.95)] border-t border-white/10 rounded-t-2xl sm:rounded-t-[32px]'
            : ''
        } ${className}`}
      >
        {/* Subtle decorative section index / progress tag on the edge */}
        {badge && (
          <div className="absolute top-4 right-6 z-30 hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-[#A1A1A1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] animate-pulse" />
            <span>SECTOR {String(index + 1).padStart(2, '0')} // {badge}</span>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 w-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
