
import React from 'react';

export default function ActionButton({ type = 'button', disabled = false, children, onClick }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
