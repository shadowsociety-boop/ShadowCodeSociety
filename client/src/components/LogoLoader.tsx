import React from 'react';
import { motion } from 'framer-motion';

interface LogoLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

const EMBLEM_BLOCKS = [
  { id: 'ear-l', x: 87, y: 216, w: 33, h: 43, delay: 0.02 },
  { id: 'ear-r', x: 335, y: 216, w: 33, h: 43, delay: 0.02 },
  { id: 'horn-l', x: 171, y: 101, w: 33, h: 33, delay: 0.06 },
  { id: 'horn-r', x: 255, y: 101, w: 33, h: 33, delay: 0.06 },
  { id: 'temple-l1', x: 129, y: 131, w: 33, h: 42, delay: 0.1 },
  { id: 'temple-r1', x: 293, y: 131, w: 33, h: 42, delay: 0.1 },
  { id: 'temple-l2', x: 129, y: 174, w: 33, h: 42, delay: 0.14 },
  { id: 'temple-r2', x: 293, y: 174, w: 33, h: 42, delay: 0.14 },
  { id: 'cheek-l', x: 155, y: 227, w: 32, h: 16, delay: 0.18 },
  { id: 'cheek-r', x: 272, y: 226, w: 33, h: 17, delay: 0.18 },
  { id: 'jaw-l1', x: 129, y: 259, w: 33, h: 42, delay: 0.22 },
  { id: 'jaw-r1', x: 293, y: 259, w: 33, h: 42, delay: 0.22 },
  { id: 'jaw-l2', x: 129, y: 302, w: 33, h: 32, delay: 0.26 },
  { id: 'jaw-r2', x: 293, y: 302, w: 33, h: 32, delay: 0.26 },
  { id: 'chin-l', x: 171, y: 338, w: 33, h: 26, delay: 0.3 },
  { id: 'chin-r', x: 256, y: 338, w: 32, h: 26, delay: 0.3 },
  { id: 'tooth-l', x: 180, y: 252, w: 32, h: 17, delay: 0.34 },
  { id: 'tooth-c', x: 213, y: 252, w: 33, h: 17, delay: 0.38 },
  { id: 'tooth-r', x: 247, y: 252, w: 33, h: 17, delay: 0.34 },
  { id: 'eye-l', x: 192, y: 184, w: 33, h: 33, delay: 0.44, isEye: true },
  { id: 'eye-r', x: 239, y: 184, w: 32, h: 33, delay: 0.44, isEye: true },
];

export const LogoLoader: React.FC<LogoLoaderProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 select-none ${className}`}>
      <div className={`relative ${dimensions[size]} flex items-center justify-center`}>
        {/* Ambient Pulsing Glow */}
        <motion.div
          animate={{
            scale: [0.95, 1.15, 0.95],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-[#FF4D1C]/20 blur-xl pointer-events-none"
        />

        {/* Outer Rotating HUD Reticle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-8px] rounded-full border border-dashed border-[#FF4D1C]/30 pointer-events-none"
        />

        {/* Counter-rotating Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-4px] rounded-full border border-white/[0.08] pointer-events-none"
        />

        {/* 4 Corner Targeting Crosshairs */}
        <div className="absolute inset-[-10px] pointer-events-none opacity-80">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF4D1C]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FF4D1C]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FF4D1C]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FF4D1C]" />
        </div>

        {/* Procedural Logo Glyph Assembly */}
        <svg
          viewBox="82.5 87.5 290 290"
          fill="none"
          className="relative w-full h-full drop-shadow-[0_0_12px_rgba(255,77,28,0.7)]"
        >
          {EMBLEM_BLOCKS.map((block) => (
            <motion.rect
              key={block.id}
              x={block.x}
              y={block.y}
              width={block.w}
              height={block.h}
              initial={{ opacity: 0.2, scale: 0.8 }}
              animate={{
                opacity: [0.4, 1, 0.7, 1],
                scale: [0.9, 1.02, 0.95, 1],
                fill: block.isEye
                  ? ['#FFFFFF', '#FF4D1C', '#FFFFFF', '#FF4D1C']
                  : ['#FF4D1C', '#FF6E38', '#FF4D1C'],
              }}
              transition={{
                delay: block.delay,
                duration: block.isEye ? 1.4 : 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>

        {/* Vertical Laser Scanline */}
        <motion.div
          animate={{
            top: ['0%', '100%', '0%'],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[-10%] right-[-10%] h-[1.5px] bg-[#FF4D1C] shadow-[0_0_8px_#FF4D1C] z-10 pointer-events-none"
        />
      </div>

      {text && (
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] animate-pulse" />
          <span className="tracking-wider uppercase text-[11px]">{text}</span>
        </div>
      )}
    </div>
  );
};
