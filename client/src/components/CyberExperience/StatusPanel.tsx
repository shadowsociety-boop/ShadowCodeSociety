import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  icon?: LucideIcon;
  label: string;
  value?: string;
  status?: 'online' | 'warning' | 'secure' | 'neutral';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  icon: Icon,
  label,
  value,
  status = 'neutral',
  className = '',
}) => {
  const statusColors = {
    online: 'bg-emerald-400 text-emerald-400',
    secure: 'bg-[#FF4D1C] text-[#FF4D1C]',
    warning: 'bg-amber-400 text-amber-400',
    neutral: 'bg-zinc-400 text-zinc-400',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07070A]/85 border border-white/10 backdrop-blur-md text-[10px] font-mono text-zinc-300 shadow-lg ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusColors[status].split(' ')[0]} animate-pulse`} />
      {Icon && <Icon className={`w-3 h-3 ${statusColors[status].split(' ')[1]}`} />}
      <span className="text-zinc-400">{label}</span>
      {value && (
        <>
          <span className="text-zinc-600">//</span>
          <span className="text-white font-semibold">{value}</span>
        </>
      )}
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  detail?: string;
  icon?: LucideIcon;
  accent?: 'orange' | 'emerald' | 'amber';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  detail,
  icon: Icon,
  accent = 'orange',
  className = '',
}) => {
  const accentBorder = {
    orange: 'border-[#FF4D1C]/40 text-[#FF4D1C]',
    emerald: 'border-emerald-500/40 text-emerald-400',
    amber: 'border-amber-500/40 text-amber-400',
  };

  return (
    <div
      className={`p-3.5 rounded-xl bg-[#090A0E]/90 border border-white/10 ${accentBorder[accent].split(' ')[0]} backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.85)] text-left font-mono ${className}`}
    >
      <div className="flex items-center justify-between text-[9.5px] text-zinc-400 pb-1.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
          {Icon && <Icon className={`w-3.5 h-3.5 ${accentBorder[accent].split(' ')[1]}`} />}
          {title}
        </div>
      </div>
      <div className="pt-2">
        <div className="text-xl font-bold font-['Space_Grotesk'] text-white leading-none tracking-tight">
          {value}
        </div>
        {detail && <div className="text-[8.5px] text-zinc-400 pt-1.5">{detail}</div>}
      </div>
    </div>
  );
};
