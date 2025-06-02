import React, { ChangeEvent } from 'react';

type Option = {
  value: number | string;
  label: string;
};

type InputGroupProps = {
  label: string;
  type: 'number' | 'text' | 'select';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: Option[];
  step?: string;
  min?: number;
  max?: number;
  helperText?: string;
  placeholder?: string;
};

export const InputGroup = ({ 
  label, 
  type, 
  value, 
  onChange, 
  options = [], 
  step,
  min,
  max,
  helperText,
  placeholder
}: InputGroupProps) => {
  return (
    <div className="w-full">
      <label className="block mb-2 font-medium text-gray-700">
        {label}
      </label>
      
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="w-full">
          <input
            type={type}
            value={value}
            onChange={onChange}
            step={step}
            min={min}
            max={max}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50"
          />
          {helperText && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};