import React from 'react';

interface NetworkLayerProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'high';
}

export const NetworkLayer: React.FC<NetworkLayerProps> = ({
  className = '',
  intensity = 'medium',
}) => {
  const opacityMap = {
    subtle: 'opacity-20',
    medium: 'opacity-35',
    high: 'opacity-55',
  };

  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
      {/* Precision Background Cyber Grid */}
      <div
        className={`absolute inset-0 bg-subtle-grid ${opacityMap[intensity]} transition-opacity duration-700`}
      />

      {/* Cybernetic Coordinate Crosshairs */}
      <div className="absolute top-12 left-10 text-[9px] font-mono text-zinc-600 tracking-widest hidden md:block">
        GRID // LAT: +37.77 • LON: -122.41 [SEC_01]
      </div>
      <div className="absolute top-12 right-10 text-[9px] font-mono text-zinc-600 tracking-widest hidden md:block">
        FREQ: 433.92 MHz // STATUS: SYNCED
      </div>
      <div className="absolute bottom-8 left-10 text-[9px] font-mono text-zinc-600 tracking-widest hidden md:block">
        CIPHER: AES-GCM-256 // ZERO-DAY SHIELD
      </div>
      <div className="absolute bottom-8 right-10 text-[9px] font-mono text-zinc-600 tracking-widest hidden md:block">
        FRAME_LOCK // 60 FPS • CORE_TEMP: 38°C
      </div>

      {/* Ambient Data Telemetry Circuit Streams (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cyberLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D1C" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF4D1C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF4D1C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Diagonal and horizontal traces */}
        <line x1="0" y1="20%" x2="100%" y2="20%" stroke="url(#cyberLineGrad)" strokeWidth="0.8" strokeDasharray="8 24" />
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="url(#cyberLineGrad)" strokeWidth="0.8" strokeDasharray="16 32" />
        <line x1="25%" y1="0" x2="25%" y2="100%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 12" />
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 12" />
      </svg>
    </div>
  );
};
