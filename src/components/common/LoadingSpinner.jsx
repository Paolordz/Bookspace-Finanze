import React from 'react';

/**
 * Spinner de carga
 * @param {string} text - Texto opcional
 */
const LoadingSpinner = ({ text = 'Cargando...' }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#4f67eb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#2a1d89] font-medium">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
