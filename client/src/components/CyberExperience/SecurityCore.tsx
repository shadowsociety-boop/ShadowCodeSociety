import React from 'react';

interface SecurityCoreProps {
  bootStage?: 'boot' | 'network' | 'threat' | 'defense' | 'society';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SecurityCore: React.FC<SecurityCoreProps> = ({
  bootStage = 'boot',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-32 sm:h-32',
  };

  const svgSizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const isThreat = bootStage === 'threat';
  const isDefense = bootStage === 'defense' || bootStage === 'society';

  const borderColor = isThreat
    ? 'border-red-500/80 shadow-[0_0_35px_rgba(239,68,68,0.4)]'
    : isDefense
    ? 'border-[#FF4D1C] shadow-[0_0_40px_rgba(255,77,28,0.35)]'
    : 'border-[#FF4D1C]/50 shadow-[0_0_30px_rgba(255,77,28,0.2)]';

  const auraColor = isThreat
    ? 'bg-red-500/20'
    : isDefense
    ? 'bg-[#FF4D1C]/25'
    : 'bg-[#FF4D1C]/15';

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Atmospheric Pulse Halo */}
      <div
        className={`absolute -inset-4 rounded-full blur-xl pointer-events-none transition-all duration-700 ${auraColor} animate-pulse`}
      />

      {/* Rotating Hexagonal Forcefield Ring */}
      <div className="absolute -inset-3 sm:-inset-4 border border-[#FF4D1C]/20 rounded-full border-dashed animate-[spin_60s_linear_infinite] pointer-events-none" />
      <div className="absolute -inset-6 sm:-inset-8 border border-white/[0.04] rounded-full animate-[spin_90s_linear_infinite_reverse] pointer-events-none" />

      {/* Main Glassmorphic Security Container */}
      <div
        className={`relative ${sizeMap[size]} rounded-2xl bg-[#06070A]/90 border ${borderColor} p-3 flex flex-col items-center justify-center backdrop-blur-xl transition-all duration-500`}
      >
        {/* Corner Precision Calibrations */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#FF4D1C]" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#FF4D1C]" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#FF4D1C]" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#FF4D1C]" />

        {/* Shadow Code Shield Vector */}
        <svg viewBox="0 0 64 64" fill="none" className={svgSizeMap[size]}>
          <path
            d="M32 4L8 14V30C8 45.5 18.5 56.5 32 60C45.5 56.5 56 45.5 56 30V14L32 4Z"
            stroke={isThreat ? '#EF4444' : '#FF4D1C'}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M22 26L32 20L42 26V36C42 41 38 45 32 46C26 45 22 41 22 36V26Z"
            fill={isThreat ? '#EF4444' : '#FF4D1C'}
          />
          <circle cx="28" cy="30" r="2" fill="#06070A" />
          <circle cx="36" cy="30" r="2" fill="#06070A" />
          <path d="M29 38H35" stroke="#06070A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Interactive Status Pill */}
      <div className="mt-2.5 px-3 py-0.5 rounded-full bg-[#07080B]/90 border border-white/10 text-[9px] font-mono tracking-wider text-zinc-300 flex items-center gap-1.5 shadow-lg backdrop-blur-md">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isThreat ? 'bg-red-500' : 'bg-emerald-400'
          } animate-pulse`}
        />
        {bootStage === 'boot' && <span className="text-zinc-400">SHADOW CORE // INIT</span>}
        {bootStage === 'network' && (
          <span>
            CORE <span className="text-emerald-400">// ONLINE</span>
          </span>
        )}
        {bootStage === 'threat' && (
          <span className="text-red-400 font-semibold animate-pulse">
            ALERT // THREAT ENGAGED
          </span>
        )}
        {bootStage === 'defense' && (
          <span className="text-emerald-400 font-semibold">
            SECURE // ZERO TRUST ENGAGED
          </span>
        )}
        {bootStage === 'society' && (
          <span className="text-white font-bold">
            SHADOW CODE <span className="text-[#FF4D1C]">SOCIETY</span>
          </span>
        )}
      </div>
    </div>
  );
};
