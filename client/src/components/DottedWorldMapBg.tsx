import React from 'react';

interface DottedWorldMapBgProps {
  className?: string;
  opacity?: number;
  highlightNodes?: boolean;
}

export const DottedWorldMapBg: React.FC<DottedWorldMapBgProps> = ({
  className = '',
  opacity = 0.35,
  highlightNodes = true,
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      {/* Deep atmospheric ambient back-glows (warm ember & deep dark void) */}
      <div className="absolute -bottom-24 -left-20 w-[600px] h-[450px] bg-[#FF4D1C]/[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[500px] h-[400px] bg-[#FF4D1C]/[0.05] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* SVG Dotted Matrix World Map */}
      <svg
        className="w-full h-full object-cover opacity-80"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dotPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#FFFFFF" fillOpacity="0.12" />
          </pattern>
        </defs>

        {/* Continents rendered through masked dot matrix clusters */}
        <g fill="#A1A1A1" opacity="0.32">
          {/* North America */}
          <path d="M120,60 Q160,50 240,65 Q280,100 290,140 Q260,170 220,180 Q190,240 180,270 Q160,280 150,230 Q110,190 90,140 Q100,80 120,60 Z" fill="url(#dotPattern)" />
          <path d="M210,80 Q250,90 280,130 Q240,160 210,140 Z" fill="#FFFFFF" fillOpacity="0.08" />

          {/* South America */}
          <path d="M220,280 Q280,290 320,340 Q300,430 260,480 Q230,440 210,360 Q200,310 220,280 Z" fill="url(#dotPattern)" />
          <path d="M235,300 Q280,330 295,380 Q260,430 240,360 Z" fill="#FFFFFF" fillOpacity="0.07" />

          {/* Europe */}
          <path d="M460,70 Q530,60 560,100 Q540,150 490,160 Q460,140 450,110 Z" fill="url(#dotPattern)" />
          <path d="M475,85 Q520,80 540,120 Q500,145 475,120 Z" fill="#FFFFFF" fillOpacity="0.1" />

          {/* Africa */}
          <path d="M460,170 Q540,170 560,230 Q570,310 520,380 Q470,340 440,260 Q440,200 460,170 Z" fill="url(#dotPattern)" />
          <path d="M475,200 Q530,220 545,280 Q510,340 470,270 Z" fill="#FFFFFF" fillOpacity="0.08" />

          {/* Asia & Russia */}
          <path d="M570,50 Q750,40 880,90 Q850,180 780,220 Q720,260 670,220 Q620,190 580,150 Z" fill="url(#dotPattern)" />
          <path d="M620,80 Q760,70 820,120 Q760,180 670,160 Q620,130 620,80 Z" fill="#FFFFFF" fillOpacity="0.09" />
          {/* India subcontinent */}
          <path d="M660,180 Q710,190 730,240 Q690,300 660,260 Q640,220 660,180 Z" fill="url(#dotPattern)" />

          {/* Australia & Oceania */}
          <path d="M780,320 Q880,310 900,370 Q870,440 800,420 Q760,370 780,320 Z" fill="url(#dotPattern)" />
          <path d="M800,335 Q860,330 875,380 Q840,410 800,375 Z" fill="#FFFFFF" fillOpacity="0.08" />
        </g>

        {/* Active Node Pulse Coordinates */}
        {highlightNodes && (
          <g>
            {/* San Francisco Node */}
            <circle cx="150" cy="140" r="3" fill="#FF4D1C" />
            <circle cx="150" cy="140" r="8" stroke="#FF4D1C" strokeWidth="0.8" opacity="0.4" className="animate-ping" />

            {/* New York Node */}
            <circle cx="260" cy="130" r="2.5" fill="#FF4D1C" />

            {/* London Node */}
            <circle cx="485" cy="105" r="3" fill="#FF4D1C" />
            <circle cx="485" cy="105" r="8" stroke="#FF4D1C" strokeWidth="0.8" opacity="0.4" className="animate-ping" />

            {/* Frankfurt Node */}
            <circle cx="510" cy="115" r="2" fill="#FFFFFF" opacity="0.8" />

            {/* Bangalore / Delhi Node */}
            <circle cx="685" cy="225" r="3.5" fill="#FF4D1C" />
            <circle cx="685" cy="225" r="10" stroke="#FF4D1C" strokeWidth="1" opacity="0.5" className="animate-ping" />

            {/* Tokyo Node */}
            <circle cx="850" cy="150" r="3" fill="#FF4D1C" />
            <circle cx="850" cy="150" r="7" stroke="#FF4D1C" strokeWidth="0.8" opacity="0.4" className="animate-ping" />

            {/* Singapore Node */}
            <circle cx="750" cy="270" r="2.5" fill="#FF4D1C" />

            {/* Sydney Node */}
            <circle cx="880" cy="380" r="2.5" fill="#FF4D1C" />

            {/* Arc / Flight Connection Lines */}
            <path
              d="M150,140 Q310,60 485,105"
              stroke="#FF4D1C"
              strokeWidth="0.75"
              strokeDasharray="3 4"
              opacity="0.35"
            />
            <path
              d="M485,105 Q585,140 685,225"
              stroke="#FF4D1C"
              strokeWidth="0.75"
              strokeDasharray="3 4"
              opacity="0.35"
            />
            <path
              d="M685,225 Q770,180 850,150"
              stroke="#FF4D1C"
              strokeWidth="0.75"
              strokeDasharray="3 4"
              opacity="0.35"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
