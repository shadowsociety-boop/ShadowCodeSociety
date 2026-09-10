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
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <div className="absolute inset-0 bg-[#FF4D1C]/25 blur-md rounded-lg group-hover:bg-[#FF4D1C]/45 transition-all duration-300" />
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-[0_0_8px_rgba(255,77,28,0.5)]"
        >
          {/* Outer Shield Frame */}
          <path
            d="M32 4L8 14V30C8 45.5 18.5 56.5 32 60C45.5 56.5 56 45.5 56 30V14L32 4Z"
            stroke="#FF4D1C"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="fill-[#0A0B10]/90"
          />
          {/* Inner Accent Line */}
          <path
            d="M32 10L14 18V30C14 42 21.5 50.5 32 54C42.5 50.5 50 42 50 30V18L32 10Z"
            stroke="#FF4D1C"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          {/* Cyber Skull / Code Visor */}
          <path
            d="M22 26L32 20L42 26V36C42 41 38 45 32 46C26 45 22 41 22 36V26Z"
            fill="#FF4D1C"
            className="transition-colors"
          />
          {/* Eyes (Terminal Prompts) */}
          <rect x="26" y="28" width="3.5" height="3.5" rx="0.5" fill="#0A0B10" />
          <rect x="34.5" y="28" width="3.5" height="3.5" rx="0.5" fill="#0A0B10" />
          {/* Code Slash */}
          <path
            d="M28 39L36 39M30 36L34 42"
            stroke="#0A0B10"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Circuit nodes */}
          <circle cx="32" cy="14" r="1.5" fill="#FF4D1C" />
          <circle cx="18" cy="24" r="1.5" fill="#FF4D1C" opacity="0.6" />
          <circle cx="46" cy="24" r="1.5" fill="#FF4D1C" opacity="0.6" />
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
