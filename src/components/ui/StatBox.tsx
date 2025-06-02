import React from 'react';

type StatBoxProps = {
  label: string;
  value: string;
  positive?: boolean;
};

export const StatBox = ({ label, value, positive = false }: StatBoxProps) => {
  return (
    <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
      <div className={`text-xl font-bold mb-1 ${positive ? 'text-green-600' : 'text-gray-800'}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600 font-medium">
        {label}
      </div>
    </div>
  );
};