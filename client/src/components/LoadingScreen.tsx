import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '../utils/sound';

interface LoadingScreenProps {
  onComplete: () => void;
}

interface EmblemBlock {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  group: 'outer' | 'frame' | 'teeth' | 'eyes';
  delay: number;
}

const EMBLEM_BLOCKS: EmblemBlock[] = [
  // Outer peripheral anchor beacons (Phase 1)
  { id: 'ear-l', x: 87, y: 216, w: 33, h: 43, group: 'outer', delay: 0.05 },
  { id: 'ear-r', x: 335, y: 216, w: 33, h: 43, group: 'outer', delay: 0.05 },

  // Top horns / brows (Phase 2)
  { id: 'horn-l', x: 171, y: 101, w: 33, h: 33, group: 'frame', delay: 0.15 },
  { id: 'horn-r', x: 255, y: 101, w: 33, h: 33, group: 'frame', delay: 0.15 },

  // Outer temples (Phase 3)
  { id: 'temple-l1', x: 129, y: 131, w: 33, h: 42, group: 'frame', delay: 0.22 },
  { id: 'temple-r1', x: 293, y: 131, w: 33, h: 42, group: 'frame', delay: 0.22 },
  { id: 'temple-l2', x: 129, y: 174, w: 33, h: 42, group: 'frame', delay: 0.28 },
  { id: 'temple-r2', x: 293, y: 174, w: 33, h: 42, group: 'frame', delay: 0.28 },

  // Lateral cheeks (Phase 4)
  { id: 'cheek-l', x: 155, y: 227, w: 32, h: 16, group: 'frame', delay: 0.35 },
  { id: 'cheek-r', x: 272, y: 226, w: 33, h: 17, group: 'frame', delay: 0.35 },

  // Lower jaw outer (Phase 5)
  { id: 'jaw-l1', x: 129, y: 259, w: 33, h: 42, group: 'frame', delay: 0.42 },
  { id: 'jaw-r1', x: 293, y: 259, w: 33, h: 42, group: 'frame', delay: 0.42 },
  { id: 'jaw-l2', x: 129, y: 302, w: 33, h: 32, group: 'frame', delay: 0.48 },
  { id: 'jaw-r2', x: 293, y: 302, w: 33, h: 32, group: 'frame', delay: 0.48 },

  // Chin base (Phase 6)
  { id: 'chin-l', x: 171, y: 338, w: 33, h: 26, group: 'frame', delay: 0.54 },
  { id: 'chin-r', x: 256, y: 338, w: 32, h: 26, group: 'frame', delay: 0.54 },

  // Teeth / Core connector bridge (Phase 7)
  { id: 'tooth-l', x: 180, y: 252, w: 32, h: 17, group: 'teeth', delay: 0.60 },
  { id: 'tooth-c', x: 213, y: 252, w: 33, h: 17, group: 'teeth', delay: 0.64 },
  { id: 'tooth-r', x: 247, y: 252, w: 33, h: 17, group: 'teeth', delay: 0.60 },

  // Optic Eyes (Core ignition! Phase 8)
  { id: 'eye-l', x: 192, y: 184, w: 33, h: 33, group: 'eyes', delay: 0.72 },
  { id: 'eye-r', x: 239, y: 184, w: 32, h: 33, group: 'eyes', delay: 0.72 },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'init' | 'assembling' | 'ignited' | 'granted' | 'exit'>('init');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Play subtle initialization tick
    soundFx.playTick();

    // Progress counter animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = prev < 50 ? 3 : prev < 85 ? 4 : 2;
        return Math.min(100, prev + increment);
      });
    }, 45);

    // Sequence stages
    const t1 = setTimeout(() => {
      setPhase('assembling');
      soundFx.playTick();
    }, 400);

    const t2 = setTimeout(() => {
      setPhase('ignited');
      soundFx.playTick();
    }, 1000);

    const t3 = setTimeout(() => {
      setPhase('granted');
      soundFx.playChime();
    }, 1550);

    const t4 = setTimeout(() => setPhase('exit'), 2000);
    const t5 = setTimeout(() => onComplete(), 2350);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Subtle Cyber Grid Matrix */}
          <div className="absolute inset-0 bg-subtle-grid opacity-35 pointer-events-none" />

          {/* Vignette Gradient */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/60 to-[#050505] pointer-events-none" />

          {/* Central Security Assembly Chamber */}
          <div className="relative flex flex-col items-center z-10">
            {/* Holographic Logo Reticle Chamber */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 mb-10 flex items-center justify-center">
              {/* Radial Energy Bloom */}
              <motion.div
                animate={{
                  scale: phase === 'granted' ? [1, 1.8] : [0.95, 1.15, 0.95],
                  opacity: phase === 'granted' ? [0.6, 0] : [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: phase === 'granted' ? 0.6 : 2,
                  repeat: phase === 'granted' ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full bg-[#FF4D1C]/25 blur-2xl pointer-events-none"
              />

              {/* Shockwave Burst on Access Granted */}
              {phase === 'granted' && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 2.8, opacity: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-[#FF4D1C] bg-[#FF4D1C]/15 blur-sm pointer-events-none"
                />
              )}

              {/* Outer Rotating HUD Reticle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-24px] rounded-full border border-dashed border-[#FF4D1C]/30 pointer-events-none"
              />

              {/* Counter-rotating Precision Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-12px] rounded-full border border-white/[0.08] pointer-events-none"
              />

              {/* HUD Corner Targeting Brackets */}
              <motion.div
                initial={{ inset: '-32px', opacity: 0 }}
                animate={{ inset: '-18px', opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute pointer-events-none"
              >
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF4D1C]" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF4D1C]" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF4D1C]" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF4D1C]" />
              </motion.div>

              {/* Animated SVG Emblem Blocks Assembly */}
              <svg
                viewBox="82.5 87.5 290 290"
                fill="none"
                className="w-24 h-24 sm:w-28 sm:h-28 relative z-10 drop-shadow-[0_0_18px_rgba(255,77,28,0.75)]"
              >
                {EMBLEM_BLOCKS.map((block) => (
                  <motion.rect
                    key={block.id}
                    x={block.x}
                    y={block.y}
                    width={block.w}
                    height={block.h}
                    initial={{
                      opacity: 0,
                      scale: 0.2,
                      fill: '#FFFFFF',
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      fill:
                        block.group === 'eyes'
                          ? phase === 'ignited' || phase === 'granted'
                            ? ['#FFFFFF', '#FF4D1C', '#FFFFFF', '#FF4D1C']
                            : '#FF4D1C'
                          : '#FF4D1C',
                    }}
                    transition={{
                      delay: block.delay,
                      duration: block.group === 'eyes' ? 0.6 : 0.4,
                      repeat: block.group === 'eyes' && phase !== 'granted' ? Infinity : 0,
                      repeatDelay: 1.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                ))}
              </svg>

              {/* Sweeping Laser Scanner Beam */}
              <motion.div
                animate={{
                  top: ['-10%', '110%', '-10%'],
                  opacity: [0.15, 0.9, 0.15],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute left-[-20%] right-[-20%] h-[2px] bg-gradient-to-r from-transparent via-[#FF4D1C] to-transparent shadow-[0_0_12px_#FF4D1C] z-20 pointer-events-none"
              />
            </div>

            {/* Brand Typography */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center mb-6"
            >
              <h1 className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-white font-['Space_Grotesk'] uppercase">
                SHADOW<span className="text-[#FF4D1C]">CODE</span> SOCIETY
              </h1>
              <p className="text-[10px] sm:text-[11px] font-mono text-zinc-500 tracking-[0.2em] uppercase mt-1">
                AUTONOMOUS SECURITY CORPS // NODE 0xSCS
              </p>
            </motion.div>

            {/* Terminal Boot Telemetry Box */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-80 bg-[#0B0B0B] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between font-mono text-xs shadow-2xl"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    phase === 'granted'
                      ? 'bg-[#FF4D1C] shadow-[0_0_10px_#FF4D1C]'
                      : 'bg-[#FF4D1C] animate-pulse'
                  }`}
                />
                <span className="text-zinc-300 text-[11px] tracking-wider uppercase font-medium">
                  {phase === 'init' && 'INITIALIZING CIPHER PROTOCOL...'}
                  {phase === 'assembling' && 'ASSEMBLING NEURAL EMBLEM...'}
                  {phase === 'ignited' && 'CORE SYNCHRONIZATION OK'}
                  {phase === 'granted' && 'AUTHENTICATED // ACCESS GRANTED'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#FF4D1C] tracking-wider font-mono">
                {String(progress).padStart(3, '0')}%
              </span>
            </motion.div>

            {/* Micro Hairline Neon Progress Track */}
            <div className="w-80 h-[2px] bg-white/10 mt-2.5 rounded-full overflow-hidden">
              <motion.div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-[#FF6E38] to-[#FF4D1C] shadow-[0_0_8px_#FF4D1C]"
              />
            </div>

            {/* Auxiliary Hex Memory Telemetry */}
            <div className="w-80 flex items-center justify-between text-[9px] font-mono text-zinc-600 mt-2 px-1">
              <span>MEM_0x4F8A // SYS_OK</span>
              <span>SHA256_VERIFIED</span>
              <span>SEC_LEVEL_01</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
