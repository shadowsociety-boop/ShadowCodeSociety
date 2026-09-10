import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'group inline-flex items-center justify-center font-mono tracking-wider uppercase text-xs transition-all duration-200 select-none focus:outline-none focus:ring-1 focus:ring-[#FF4D1C] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const sizes = {
      sm: 'px-3.5 py-2 rounded gap-1.5 text-[11px]',
      md: 'px-5 py-2.5 rounded gap-2 text-xs',
      lg: 'px-7 py-3.5 rounded gap-2.5 text-xs font-semibold',
    };

    const variants = {
      primary:
        'bg-[#FF4D1C] hover:bg-[#FF3B00] text-white shadow-[0_0_18px_rgba(255,77,28,0.28)] hover:shadow-[0_0_25px_rgba(255,77,28,0.45)] hover:-translate-y-0.5 active:translate-y-0',
      secondary:
        'bg-transparent hover:bg-white/[0.04] text-[#F5F5F5] border border-white/15 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0',
      outline:
        'bg-transparent hover:bg-[#FF4D1C]/[0.08] text-[#A1A1A1] hover:text-[#FF4D1C] border border-white/10 hover:border-[#FF4D1C]/50 hover:-translate-y-0.5 active:translate-y-0',
      ghost:
        'bg-transparent hover:bg-white/5 text-[#A1A1A1] hover:text-white',
      danger:
        'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 hover:-translate-y-0.5 active:translate-y-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
