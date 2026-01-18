import React from 'react';

/**
 * Barra de progreso con colores
 * @param {number} value - Valor actual
 * @param {number} max - Valor máximo
 * @param {string} color - Color de la barra (primary, success, danger, warning)
 */
const ProgressBar = ({ value, max, color = 'primary' }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  const colors = {
    primary: 'bg-[#4f67eb]',
    success: 'bg-emerald-500',
    danger: 'bg-red-500',
    warning: 'bg-amber-500'
  };

  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`${colors[color]} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;
