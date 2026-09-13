import React from 'react';

interface ScrollControllerProps {
  currentStage: number; // 0 to 4
  progress: number; // 0 to 1
  onSelectStage?: (stageIndex: number) => void;
}

const STAGES = [
  { id: '01', title: 'BOOT' },
  { id: '02', title: 'NETWORK' },
  { id: '03', title: 'THREAT' },
  { id: '04', title: 'DEFENSE' },
  { id: '05', title: 'SOCIETY' },
];

export const ScrollController: React.FC<ScrollControllerProps> = ({
  currentStage,
  progress,
  onSelectStage,
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 select-none pointer-events-auto">
      {/* Interactive Step Pills */}
      <div className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-[#050608]/85 border border-white/10 backdrop-blur-md shadow-2xl">
        {STAGES.map((s, idx) => {
          const isActive = currentStage === idx;
          const isPassed = currentStage > idx;

          return (
            <button
              key={s.id}
              onClick={() => onSelectStage && onSelectStage(idx)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono transition-all duration-300 ${
                isActive
                  ? 'bg-[#FF4D1C] text-black font-bold shadow-[0_0_12px_rgba(255,77,28,0.6)]'
                  : isPassed
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <span>{s.id}</span>
              <span className="hidden md:inline">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Scrub Progress Bar */}
      <div className="w-36 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF4D1C] to-emerald-400 rounded-full transition-all duration-75"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>
    </div>
  );
};
