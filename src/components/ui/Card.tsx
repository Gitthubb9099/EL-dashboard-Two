import React, { ReactNode } from 'react';

type CardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export const Card = ({ title, children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition hover:shadow-lg ${className}`}>
      <h3 className="p-5 border-b border-gray-100 font-semibold text-gray-800 text-lg">
        {title}
      </h3>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};