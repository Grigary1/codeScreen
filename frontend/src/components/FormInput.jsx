
import React from 'react';

export default function FormInput({ id, name, type = 'text', placeholder, value, onChange, icon }) {
  return (
    <div className="flex items-center border border-gray-600 rounded-lg p-2 bg-gray-700">
      {icon && <div className="mr-2 text-gray-400">{icon}</div>}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="bg-transparent w-full outline-none text-white placeholder-gray-400"
      />
    </div>
  );
}
