import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-brand-navy">{label}</label>}
        <input
          ref={ref}
          className={`w-full rounded-xl bg-gray-100 border-none px-4 py-3 text-brand-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue ${error ? 'ring-2 ring-brand-danger' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-brand-danger mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
