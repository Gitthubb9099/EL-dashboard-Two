import React, { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'secondary';
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}: ButtonProps) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-opacity-50";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-400",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-300",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};