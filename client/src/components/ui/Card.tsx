import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glow?: boolean;
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hoverable = false, glow = false, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg bg-[#0B0B0B] border border-white/[0.08] p-6 transition-all duration-300 relative overflow-hidden ${
          hoverable
            ? 'hover:border-white/20 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]'
            : ''
        } ${glow ? 'shadow-[0_0_25px_-5px_rgba(255,77,28,0.2)] border-[#FF4D1C]/35' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
