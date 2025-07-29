
import React from 'react';

export default function SelectInput({ id, name, value, onChange, options = [], placeholder }) {
  return (
    <div className="border border-gray-600 rounded-lg p-2 bg-gray-700 text-white">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none"
        required
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  );
}
