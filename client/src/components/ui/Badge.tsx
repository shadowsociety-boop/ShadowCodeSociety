import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'green' | 'cyan' | 'purple' | 'red' | 'zinc';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  size = 'sm',
  pulse = false,
  className = '',
}) => {
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-mono',
    md: 'text-[11px] px-2.5 py-1 font-mono font-medium',
  };

  const variants = {
    orange: 'bg-[#FF4D1C]/10 text-[#FF4D1C] border border-[#FF4D1C]/25',
    green: 'bg-[#FF4D1C]/10 text-[#FF4D1C] border border-[#FF4D1C]/25',
    cyan: 'bg-[#FF4D1C]/10 text-[#FF4D1C] border border-[#FF4D1C]/25',
    purple: 'bg-[#FF4D1C]/10 text-[#FF4D1C] border border-[#FF4D1C]/25',
    red: 'bg-[#FF4D1C]/10 text-[#FF4D1C] border border-[#FF4D1C]/25',
    zinc: 'bg-white/[0.04] text-[#A1A1A1] border border-white/10',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded uppercase tracking-[0.15em] select-none ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};
