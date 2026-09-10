import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-mono tracking-wider uppercase text-zinc-400 font-medium">
            {label}
            {props.required && <span className="text-[#FF4D1C] ml-1">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={`w-full bg-[#0a0c13] text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-3 text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4D1C]/40 focus:border-[#FF4D1C]/80 min-h-[100px] resize-y ${
            error
              ? 'border-red-500/80 focus:ring-red-500/30'
              : 'border-white/10 hover:border-white/20'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-400 font-mono flex items-center gap-1 mt-1">
            <span>⚠</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-zinc-500 font-mono mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
