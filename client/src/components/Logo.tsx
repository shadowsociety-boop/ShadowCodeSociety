import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  clickable?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  clickable = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Emblem SVG */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center`}>
        <div className="absolute inset-0 bg-[#FF4D1C]/20 blur-md rounded-lg group-hover:bg-[#FF4D1C]/40 transition-all duration-300" />
        <svg
          viewBox="82.5 87.5 290 290"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-[0_0_10px_rgba(255,77,28,0.5)]"
        >
          <g fill="currentColor" className="text-white group-hover:text-[#FF4D1C] transition-colors duration-300">
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
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-wider text-white font-['Space_Grotesk'] ${textSizes[size]} transition-colors group-hover:text-white`}
            >
              SHADOW<span className="text-[#FF4D1C]">CODE</span>
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase font-semibold mt-0.5 group-hover:text-zinc-300">
            SOCIETY // 0xSCS
          </span>
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
