import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "w-full rounded-2xl font-black py-4 px-4 transition-all duration-75 flex items-center justify-center text-center disabled:opacity-70 disabled:cursor-not-allowed text-lg mb-2";
  
  const variants = {
    primary: "bg-brand-blue text-brand-navy shadow-[0_6px_0_0_var(--color-brand-blue-dark)] active:shadow-none active:translate-y-[6px] hover:brightness-105 uppercase tracking-widest",
    secondary: "bg-gray-200 text-brand-navy shadow-[0_6px_0_0_#9CA3AF] active:shadow-none active:translate-y-[6px] hover:brightness-105 uppercase tracking-widest",
    danger: "bg-brand-danger text-white shadow-[0_6px_0_0_#CC3B3B] active:shadow-none active:translate-y-[6px] hover:brightness-105 uppercase tracking-widest",
    ghost: "bg-transparent text-brand-blue hover:bg-gray-100 uppercase tracking-widest mb-0"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></span>
      ) : children}
    </button>
  );
};
