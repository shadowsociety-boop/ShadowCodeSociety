import React from 'react';
import { motion } from 'framer-motion';

export const HeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[560px] aspect-square flex items-center justify-center select-none pointer-events-none mx-auto">
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[#FF4D1C]/[0.08] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute w-72 h-72 bg-[#FF4D1C]/[0.03] rounded-full blur-[80px] pointer-events-none" />

      {/* SVG Circuit & Node Canvas */}
      <svg
        className="w-full h-full relative z-10"
        viewBox="0 0 600 600"
        fill="none"
      >
        {/* Subtle Background Coordinate Circles */}
        <circle cx="300" cy="300" r="260" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="300" cy="300" r="190" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx="300" cy="300" r="120" stroke="rgba(255,77,28,0.12)" strokeWidth="1" />

        {/* Central Rotating Target Ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '300px 300px' }}
        >
          <circle cx="300" cy="300" r="160" stroke="rgba(255,77,28,0.2)" strokeWidth="1" strokeDasharray="16 120" />
          <circle cx="300" cy="300" r="220" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="30 90" />
        </motion.g>

        {/* Connecting Network Lines */}
        <line x1="300" y1="300" x2="130" y2="150" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="300" y1="300" x2="470" y2="160" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="300" y1="300" x2="490" y2="410" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="300" y1="300" x2="140" y2="430" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="130" y1="150" x2="470" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="470" y1="160" x2="490" y2="410" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="490" y1="410" x2="140" y2="430" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Data Packets Moving Along Lines */}
        <motion.circle
          r="2.5"
          fill="#FF4D1C"
          animate={{
            cx: [300, 130, 300],
            cy: [300, 150, 300],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          r="2.5"
          fill="#FF4D1C"
          animate={{
            cx: [300, 470, 300],
            cy: [300, 160, 300],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.circle
          r="2.5"
          fill="#FF4D1C"
          animate={{
            cx: [300, 490, 300],
            cy: [300, 410, 300],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Node 01 - Top Left */}
        <motion.g
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="130" cy="150" r="6" fill="#0B0B0B" stroke="#FF4D1C" strokeWidth="1.5" />
          <circle cx="130" cy="150" r="2" fill="#FF4D1C" />
          <rect x="50" y="125" width="70" height="20" rx="3" fill="#0B0B0B" stroke="rgba(255,255,255,0.1)" />
          <text x="56" y="138" fill="#F5F5F5" fontSize="8.5" fontFamily="monospace" fontWeight="500">NODE_01</text>
          <text x="50" y="156" fill="#666666" fontSize="7.5" fontFamily="monospace">ENCRYPTED</text>
        </motion.g>

        {/* Node 02 - Top Right */}
        <motion.g
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="470" cy="160" r="6" fill="#0B0B0B" stroke="#FF4D1C" strokeWidth="1.5" />
          <circle cx="470" cy="160" r="2" fill="#FF4D1C" />
          <rect x="480" y="135" width="70" height="20" rx="3" fill="#0B0B0B" stroke="rgba(255,255,255,0.1)" />
          <text x="486" y="148" fill="#F5F5F5" fontSize="8.5" fontFamily="monospace" fontWeight="500">NODE_02</text>
          <text x="480" y="166" fill="#FF4D1C" fontSize="7.5" fontFamily="monospace">SECURE</text>
        </motion.g>

        {/* Node 03 - Bottom Right */}
        <motion.g
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="490" cy="410" r="6" fill="#0B0B0B" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <circle cx="490" cy="410" r="2" fill="#F5F5F5" />
          <rect x="500" y="395" width="80" height="20" rx="3" fill="#0B0B0B" stroke="rgba(255,255,255,0.1)" />
          <text x="506" y="408" fill="#F5F5F5" fontSize="8.5" fontFamily="monospace" fontWeight="500">NODE_03</text>
          <text x="500" y="426" fill="#666666" fontSize="7.5" fontFamily="monospace">PORT: 443</text>
        </motion.g>

        {/* Node 04 - Bottom Left */}
        <motion.g
          animate={{ y: [3, -3, 3] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="140" cy="430" r="6" fill="#0B0B0B" stroke="#FF4D1C" strokeWidth="1.5" />
          <circle cx="140" cy="430" r="2" fill="#FF4D1C" />
          <rect x="45" y="415" width="85" height="20" rx="3" fill="#0B0B0B" stroke="rgba(255,255,255,0.1)" />
          <text x="51" y="428" fill="#F5F5F5" fontSize="8.5" fontFamily="monospace" fontWeight="500">GATEWAY_0x</text>
          <text x="45" y="446" fill="#FF4D1C" fontSize="7.5" fontFamily="monospace">STATUS: ACTIVE</text>
        </motion.g>
      </svg>

      {/* Central Identity Crest */}
      <div className="absolute z-20 flex flex-col items-center">
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-2xl bg-[#0B0B0B] border border-white/15 p-4 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
              <path
                d="M32 4L8 14V30C8 45.5 18.5 56.5 32 60C45.5 56.5 56 45.5 56 30V14L32 4Z"
                stroke="#FF4D1C"
                strokeWidth="2.5"
              />
              <path
                d="M22 26L32 20L42 26V36C42 41 38 45 32 46C26 45 22 41 22 36V26Z"
                fill="#FF4D1C"
              />
              <circle cx="28" cy="30" r="2" fill="#0B0B0B" />
              <circle cx="36" cy="30" r="2" fill="#0B0B0B" />
              <path d="M29 38H35" stroke="#0B0B0B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          {/* Subtle Live Badge under center */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#050505] border border-white/10 text-[9px] font-mono text-[#A1A1A1] whitespace-nowrap flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] animate-pulse" />
            0xSCS_CORE
          </div>
        </motion.div>
      </div>
    </div>
  );
};
