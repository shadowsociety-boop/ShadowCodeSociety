import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'init' | 'scanning' | 'online' | 'granted' | 'exit'>('init');

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // High precision sequence totaling ~1.8 seconds
    const t1 = setTimeout(() => setPhase('scanning'), 350);
    const t2 = setTimeout(() => setPhase('online'), 850);
    const t3 = setTimeout(() => setPhase('granted'), 1350);
    const t4 = setTimeout(() => setPhase('exit'), 1750);
    const t5 = setTimeout(() => onComplete(), 2050);

    return () => {
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
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Subtle Cyber Grid Backing */}
          <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />

          {/* Central Security Boot Box */}
          <div className="relative flex flex-col items-center z-10">
            {/* Logo Emblem Container with Laser Scanner Line */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative w-28 h-28 mb-8 flex items-center justify-center"
            >
              {/* Subtle Ambient Radial Glow */}
              <div className="absolute inset-0 bg-[#FF4D1C]/15 rounded-full blur-2xl" />

              {/* Logo SVG */}
              <svg
                viewBox="82.5 87.5 290 290"
                fill="none"
                className="w-20 h-20 relative z-10 drop-shadow-[0_0_15px_rgba(255,77,28,0.7)]"
              >
                <motion.g
                  fill="#FF4D1C"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <rect x="171" y="101" width="33" height="33" />
                  <rect x="255" y="101" width="33" height="33" />
                  <rect x="129" y="131" width="33" height="42" />
                  <rect x="293" y="131" width="33" height="42" />
                  <rect x="129" y="174" width="33" height="42" />
                  <rect x="293" y="174" width="33" height="42" />
                  <rect x="192" y="184" width="33" height="33" />
                  <rect x="239" y="184" width="32" height="33" />
                  <rect x="87" y="216" width="33" height="43" />
                  <rect x="335" y="216" width="33" height="43" />
                  <rect x="272" y="226" width="33" height="17" />
                  <rect x="155" y="227" width="32" height="16" />
                  <rect x="180" y="252" width="32" height="17" />
                  <rect x="213" y="252" width="33" height="17" />
                  <rect x="247" y="252" width="33" height="17" />
                  <rect x="129" y="259" width="33" height="42" />
                  <rect x="293" y="259" width="33" height="42" />
                  <rect x="129" y="302" width="33" height="32" />
                  <rect x="293" y="302" width="33" height="32" />
                  <rect x="171" y="338" width="33" height="26" />
                  <rect x="256" y="338" width="32" height="26" />
                </motion.g>
              </svg>

              {/* Thin Laser Scanning Line */}
              {phase === 'scanning' || phase === 'online' ? (
                <motion.div
                  initial={{ top: '0%', opacity: 0 }}
                  animate={{ top: ['0%', '100%', '0%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-2 right-2 h-[1.5px] bg-[#FF4D1C] shadow-[0_0_8px_#FF4D1C] z-20 pointer-events-none"
                />
              ) : null}
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center mb-6"
            >
              <h1 className="text-xl font-bold tracking-[0.25em] text-[#F5F5F5] font-['Space_Grotesk'] uppercase">
                SHADOW CODE SOCIETY
              </h1>
              <p className="text-[11px] font-mono text-[#666666] tracking-widest mt-1">
                SEC_CORPS // AUTONOMOUS NODE 0xSCS
              </p>
            </motion.div>

            {/* Terminal Boot Telemetry Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-72 bg-[#0B0B0B] border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between font-mono text-xs shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    phase === 'granted'
                      ? 'bg-[#FF4D1C] shadow-[0_0_8px_#FF4D1C]'
                      : 'bg-[#FF4D1C] animate-pulse'
                  }`}
                />
                <span className="text-[#A1A1A1] text-[11px] tracking-wider uppercase">
                  {phase === 'init' && 'INITIALIZING SHADOW CODE SOCIETY'}
                  {phase === 'scanning' && 'INITIALIZING SHADOW CODE SOCIETY'}
                  {phase === 'online' && 'STATUS: ONLINE'}
                  {phase === 'granted' && 'ACCESS GRANTED'}
                </span>
              </div>
              <span className="text-[10px] text-[#666666]">
                {phase === 'init' || phase === 'scanning'
                  ? 'SYS_BOOT'
                  : phase === 'online'
                  ? 'OK'
                  : 'AUTH_200'}
              </span>
            </motion.div>

            {/* Micro Hairline Progress */}
            <div className="w-72 h-[1px] bg-white/10 mt-2 overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{
                  width:
                    phase === 'init'
                      ? '25%'
                      : phase === 'scanning'
                      ? '65%'
                      : phase === 'online'
                      ? '88%'
                      : '100%',
                }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="h-full bg-[#FF4D1C]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
